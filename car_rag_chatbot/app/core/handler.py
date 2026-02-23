import random

def handle_greeting(text): # under 'greeting' intent
    text = text.lower()

    if "how are you" in text:
        return random.choice([
            "I'm doing great! 😊 Ready to help you find the perfect car.",
            "I'm doing well, thank you! 🚗 What car are you looking for?",
            "All good here! How can I assist you today?"
        ])

    elif "good morning" in text or "gm" in text:
        return "Good morning! ☀️ Looking for a car today?"

    elif "good evening" in text:
        return "Good evening! 🌙 How can I assist you with cars?"

    elif "whats up" in text or "what's up" in text:
        return "Not much! 🚗 Just here to help you find your ideal car."

    elif "thank you" in text or "thanks" in text:
        return "You're Wellcome Dear."
    
    else:
        return random.choice([
            "Hello! 👋 How can I help you today?",
            "Hi there! 😊 What can I assist you with?",
            "Hey! 🚗 Looking for something specific?"
        ])

def handle_goodbye(text): # under 'goodbye' intent
    text = text.lower()

    if "good night" in text:
        return "Good night! 🌙 Drive safe and see you next time!"

    elif "see you tomorrow" in text:
        return "See you tomorrow! 😊 I'll be here to help."

    elif "thanks" in text:
        return random.choice([
            "You're welcome! 👋 Have a great day!",
            "Glad I could help! 🚗 See you next time!",
            "Anytime! 😊 Feel free to come back if you need help."
        ])

    else:
        return random.choice([
            "Goodbye! 👋 Have a great day!",
            "See you later! 🚗 Drive safe!",
            "Take care! 😊 Come back anytime.",
            "Bye for now! Let me know when you're ready to find your next car."
        ])
        
def handle_search_car(text, context = None): # under search_car, sort_year, sort_mileage, compare_cars, sort_price.
    return [
        {
            "role": "system",
            "content": (
                "You are a helpful, honest Sri Lankan car sales assistant. "
                "Answer ONLY using the provided car listings. "
                "If the answer cannot be derived from them, say exactly: "
                "'Sorry, I don't have matching cars for that.' "
                "Do not invent prices, features, or availability."
            ),
        },
        {
            "role": "user",
            "content": f"""
Available car listings:
{context}

Customer question:
{text}
""",
        },
    ]
    

def handle_location():
    return (
        "We have two showroom locations:\n\n"
        "1️⃣ 109 Sunethradevi Rd, Nugegoda\n"
        "2️⃣ 82 B345, Sri Jayawardenepura Kotte 10100\n\n"
    )

def handle_test_drive(text):
    return (
        "Thank you for your interest! 🚗\n\n"
        "Currently, we do not provide test drive services. "
        "However, you are welcome to visit our showroom to inspect the vehicle in person."
    )
    
def handle_contact():
    return (
        "📞 You can contact us at:\n\n"
        "Phone: 071 463 0444\n\n"
        "🕘 Working Hours: 9:00 AM – 7:00 PM\n\n"
        "Feel free to call us during working hours for any inquiries."
    )

def handle_negotiate_price(text):
    text = text.lower()

    # Strong negotiation phrases
    if "lowest price" in text or "final price" in text:
        return (
            "We always try to offer competitive pricing. "
            "The final price may depend on the vehicle and current offers. "
            "Please contact us to discuss further."
        )

    # Asking for discount
    if "discount" in text or "reduce" in text or "cheaper" in text:
        return (
            "We understand you're looking for the best deal. "
            "Some vehicles may have room for negotiation. "
            "Please contact us directly so we can discuss possible adjustments."
        )

    # General negotiation tone
    return random.choice([
        "Prices may be negotiable depending on the vehicle. Feel free to contact us to discuss further.",
        "We aim to offer fair pricing. Let us know which car you're interested in, and we can review the options.",
        "Some flexibility may be available. Please reach out to our team for detailed discussion."
    ])

def handle_financing_options():
    return (
        "💳 Financing Options:\n\n"
        "We can assist you with financing through bank loans or installment plans, "
        "depending on the vehicle and your eligibility.\n\n"
        "📞 For detailed financing terms and monthly installment information, "
        "please contact us."
    )

def build_fallback_prompt(user_query):
    return [
        {
            "role": "system",
            "content": (
                "You are a helpful Sri Lankan car sales assistant. "
                "The user message was unclear. "
                "Politely ask for clarification and suggest example queries. "
                "Do NOT invent car listings."
            ),
        },
        {
            "role": "user",
            "content": user_query
        }
    ]
