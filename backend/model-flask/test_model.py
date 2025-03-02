import spacy

nlp = spacy.load("en_core_web_md")

def check_subject_verb_agreement(text):
    doc = nlp(text)
    errors = []
    collective_nouns = {"group", "team", "class", "committee", "family"}
    singular_pronouns = {"each", "every", "everyone", "anyone", "nobody"}
    
    for token in doc:
        if token.dep_ == 'nsubj' and token.head.pos_ == 'VERB':
            verb = token.head
            
            if token.text.lower() in collective_nouns and verb.tag_ != "VBZ":
                errors.append(f"Error: Collective noun '{token.text}' should use a singular verb, not '{verb.text}'.")
            elif token.text.lower() in singular_pronouns and verb.tag_ != "VBZ":
                errors.append(f"Error: Indefinite pronoun '{token.text}' should be paired with a singular verb, not '{verb.text}'.")
            elif token.dep_ == 'nsubj' and any(t.text == "and" for t in doc) and verb.tag_ == "VBZ":
                errors.append(f"Error: Compound subject '{token.text}' joined by 'and' should use a plural verb, not '{verb.text}'.")
    
    return errors if errors else "No error"


def check_adjective_order(text):
    doc = nlp(text)
    errors = []
    adjective_order = ["opinion", "size", "age", "shape", "color", "origin", "material", "purpose"]
    adjective_mapping = {
        "beautiful": "opinion", "small": "size", "old": "age", "round": "shape", "red": "color",
        "French": "origin", "wooden": "material", "sleeping": "purpose"
    }
    
    for noun in [token for token in doc if token.pos_ == "NOUN"]:
        adjectives = [token for token in noun.lefts if token.pos_ == "ADJ"]
        if len(adjectives) > 1:
            adj_categories = [adjective_mapping.get(adj.text.lower(), "unknown") for adj in adjectives]
            correct_order = sorted(adj_categories, key=lambda x: adjective_order.index(x) if x in adjective_order else len(adjective_order))
            if adj_categories != correct_order:
                errors.append(f"Error: Adjective order incorrect in '{text}'. Correct order: {', '.join(correct_order)}")
    
    return errors if errors else "No error"


def check_tense(text):
    doc = nlp(text)
    errors = []
    
    for token in doc:
        if token.text.lower() in ["yesterday", "ago", "last"] and token.head.tag_ in ["VBP", "VBZ"]:
            errors.append(f"Error: Wrong verb form '{token.head.text}' with past time indicator '{token.text}'. Use past tense.")
        elif token.text == "did" and token.head.tag_ in ["VBD", "VBN"]:
            errors.append("Error: 'did' should be followed by the base form of the verb.")
        elif token.dep_ == "neg" and "did" not in [t.text for t in doc]:
            errors.append("Error: Negation in simple past requires 'did'.")
    
    return errors if errors else "No error"


def check_prepositions(text):
    doc = nlp(text)
    errors = []
    correct_prepositions = {"interested": "in", "focus": "on", "depend": "on"}
    
    for token in doc:
        if token.pos_ == "ADP" and token.head.text in correct_prepositions:
            expected = correct_prepositions[token.head.text]
            if token.text != expected:
                errors.append(f"Error: Incorrect preposition '{token.text}' for '{token.head.text}'. Expected: '{expected}'.")
    
    return errors if errors else "No error"


def check_articles(text):
    doc = nlp(text)
    errors = []
    vowel_sounds = {"a", "e", "i", "o", "u"}
    
    for token in doc:
        if token.text in {"a", "an"}:
            next_word = token.nbor(1).text.lower()
            if token.text == "a" and next_word[0] in vowel_sounds:
                errors.append(f"Error: Incorrect use of 'a' before '{next_word}'. Use 'an'.")
            elif token.text == "an" and next_word[0] not in vowel_sounds:
                errors.append(f"Error: Incorrect use of 'an' before '{next_word}'. Use 'a'.")
    
    return errors if errors else "No error"


def check_voices(text):
    doc = nlp(text)
    for token in doc:
        if token.dep_ == "auxpass" and token.head.tag_ == "VBN":
            return "Passive voice"
    return "Active voice"


def grammar_check(text):
    errors = {
        "subject_verb_agreement": check_subject_verb_agreement(text),
        "adjective_order": check_adjective_order(text),
        "tense": check_tense(text),
        "prepositions": check_prepositions(text),
        "articles": check_articles(text),
        "voice": check_voices(text)
    }
    return errors

# Example usage
text = "he have pen"
print(grammar_check(text))
