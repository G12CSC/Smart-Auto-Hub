import pandas as pd
from app.database.azure_database import get_engine
from app.utils.logger import get_logger
from sqlalchemy import text

logger = get_logger()
engine = get_engine()

df = pd.read_csv("/home/naviya-c/Downloads/ikman_data1.csv")

# Creating tem_table in azure to help merging
def input_proc():
    try:
        df.to_sql(
            name = "temp_car",
            con = engine,
            if_exists = "replace",
            index = False
        )

        logger.info(f"Successfully entered {len(df)} data to the database.")
    except Exception as e:
        logger.warning(f"File upload failed. {e}")
        
    """
    Python list has multiple strings but sql expects one string that contains all the update clause, that's why using .join()
    """
    columns = df.columns.to_list()

    update_columns = [c for c in columns if c != "id"]
    update_clause = ", ".join([f"target.{c} = source.{c}" for c in update_columns])
    insert_columns = ", ".join(columns)
    insert_values = ", ".join([f"source.{c}" for c in columns]) 

    sql_merge_query = f"""MERGE INTO Car AS target
                            USING temp_car AS source
                            ON target.id = source.id
                            WHEN MATCHED THEN
                                UPDATE SET {update_clause}
                            WHEN NOT MATCHED THEN
                                INSERT({insert_columns})
                                VALUES({insert_values});
                    """

    with engine.begin() as conn:
        conn.execute(text(sql_merge_query))
