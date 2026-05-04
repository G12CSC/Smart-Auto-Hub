import re
from typing import Dict

def parse_filters_from_text(text: str) -> Dict:
    filters = {}
    text = text.lower()
    
    # Extract numbers like "8 million" or "8m"
    price_match = re.search(r'(\d+)\s*(?:million|m)', text)
    if price_match:
        value = int(price_match.group(1)) * 1_000_000
        
        if any(w in text for w in ["under", "below", "less", "cheaper"]):
            filters['max_price'] = value
        elif any(w in text for w in ["above", "over", "more", "higher"]):
            filters['min_price'] = value
            
    return filters