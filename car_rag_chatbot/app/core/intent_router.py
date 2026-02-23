from app.core.handler import *

def intent_route(intent, user_text):

    # ---------- Rule-Based Intents ----------
    if intent == "greeting":
        return handle_greeting(user_text)

    if intent == "goodbye":
        return handle_goodbye(user_text)

    if intent == "location":
        return handle_location()

    if intent == "book_test_drive":
        return handle_test_drive(user_text)

    if intent == "contact_seller":
        return handle_contact()

    if intent == "negotiate_price":
        return handle_negotiate_price(user_text)

    if intent == "financing_options":
        return handle_financing_options()