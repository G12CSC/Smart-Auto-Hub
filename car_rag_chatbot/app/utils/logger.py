import sys
import logging

def get_logger(name:str = "car_rag_chatbot") -> logging.Logger:
    logger = logging.getLogger(name)
    
    logger.setLevel(level = logging.INFO)
    
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] %(name)s - %(message)s")
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger