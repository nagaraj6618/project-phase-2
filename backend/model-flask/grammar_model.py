#Rule based model

import spacy

nlp = spacy.load("en_core_web_md")

suggestions= []

def check_subject_verb_agreement(text):
    doc = nlp(text)
    subject_verb = False
    
    for token in doc:
        # Rule 1: Collective noun phrases like "group of students" should be treated as singular.
        if token.dep_ == 'nsubj' and token.head.pos_ == 'VERB':
            if token.text.lower() in ["group", "team", "class", "committee", "family"] and token.head.tag_ != "VBZ":
                print(f"Error: Collective noun '{token.text}' should use a singular verb, not '{token.head.text}'.")
                suggestions.append(f"Error: Collective noun '{token.text}' should use a singular verb, not '{token.head.text}'.")
                subject_verb = True

            # Rule 2: Indefinite pronouns like "each", "everyone" require a singular verb.
            elif token.text.lower() in ["each", "every", "everyone", "anyone", "nobody"] and token.head.tag_ != "VBZ":
                print(f"Error: Indefinite pronoun '{token.text}' should be paired with a singular verb, not '{token.head.text}'.")
                suggestions.append(f"Error: Indefinite pronoun '{token.text}' should be paired with a singular verb, not '{token.head.text}'.")
                subject_verb = True

            # Rule 3: Compound subjects joined by "or" or "nor" should follow the rule of proximity.
            elif token.dep_ == 'nsubj' and token.head.pos_ == 'VERB':
                compound_subjects = [t for t in doc if t.dep_ == 'nsubj' and t.head == token.head]
                if len(compound_subjects) > 1:
                    nearest_subject = compound_subjects[-1]  # Closest subject to the verb
                    if nearest_subject.tag_ in ["NNS", "NNPS"] and token.head.tag_ == "VBZ":
                        print(f"Error: Compound subject '{nearest_subject.text}' is plural, but verb '{token.head.text}' is singular.")
                        suggestions.append(f"Error: Compound subject '{nearest_subject.text}' is plural, but verb '{token.head.text}' is singular.")
                        subject_verb = True
                    elif nearest_subject.tag_ == "NN" and token.head.tag_ == "VBP":
                        print(f"Error: Compound subject '{nearest_subject.text}' is singular, but verb '{token.head.text}' is plural.")
                        suggestions.append(f"Error: Compound subject '{nearest_subject.text}' is singular, but verb '{token.head.text}' is plural.")
                        subject_verb = True

            # Rule 4: Compound subjects joined by "and" usually take a plural verb.
            elif token.dep_ == 'nsubj' and any(t.text == "and" for t in doc) and token.head.tag_ == "VBZ":
                print(f"Error: Compound subject '{token.text}' joined by 'and' should use a plural verb, not '{token.head.text}'.")
                suggestions.append(f"Error: Compound subject '{token.text}' joined by 'and' should use a plural verb, not '{token.head.text}'.")
                subject_verb = True

        # Rule 5: Existential constructions "There is/are" should agree with the number of the subject.
        if token.dep_ == "expl" and token.head.lemma_ == "be":
            existential_subject = [t for t in doc if t.dep_ == "attr" and t.head == token.head]
            if existential_subject:
                subject = existential_subject[0]
                if subject.tag_ in ["NNS", "NNPS"] and token.head.tag_ == "VBZ":
                    print(f"Error: 'There {token.head.text}' should be 'There are' since '{subject.text}' is plural.")
                    suggestions.append(f"Error: 'There {token.head.text}' should be 'There are' since '{subject.text}' is plural.")
                    subject_verb = True
                elif subject.tag_ == "NN" and token.head.tag_ == "VBP":
                    print(f"Error: 'There {token.head.text}' should be 'There is' since '{subject.text}' is singular.")
                    suggestions.append(f"Error: 'There {token.head.text}' should be 'There is' since '{subject.text}' is singular.")
                    subject_verb = True

    if subject_verb:
      errors= "subject_verb"
      return errors
    else:
      return "No error"
def check_adjective_order(text):
    doc = nlp(text)
    adjective= False
    adjective_order = [
            "opinion",  # lovely, horrible, etc.
            "size",     # big, small, etc.
            "age",      # old, new, young, etc.
            "shape",    # round, square, etc.
            "color",    # red, blue, etc.
            "origin",   # American, French, etc.
            "material", # wooden, plastic, etc.
            "purpose"   # sleeping, running, etc.
    ]
    adjective_mapping = {
        "beautiful": "opinion","ugly": "opinion","wonderful": "opinion","horrible": "opinion","amazing": "opinion","lovely": "opinion",
        "fantastic": "opinion","bad": "opinion","great": "opinion","interesting": "opinion","small": "size","big": "size","tiny": "size",
        "huge": "size","massive": "size","gigantic": "size","petite": "size","short": "size","long": "size","wide": "size","old": "age","young": "age","new": "age","ancient": "age","modern": "age","vintage": "age","old-fashioned": "age",
        "recent": "age","round": "shape","square": "shape","rectangular": "shape",
        "oval": "shape","triangular": "shape","flat": "shape","curved": "shape","red": "color","blue": "color","green": "color","yellow": "color","purple": "color","orange": "color",
        "black": "color","white": "color","pink": "color","brown": "color","American": "origin","British": "origin","French": "origin","Italian": "origin","Spanish": "origin","Japanese": "origin","Chinese": "origin","Indian": "origin","Mexican": "origin",
        "German": "origin","wooden": "material","metal": "material","plastic": "material","glass": "material","paper": "material","cotton": "material","silk": "material",
        "leather": "material","ceramic": "material","stone": "material","sleeping": "purpose","cooking": "purpose","dining": "purpose","working": "purpose","running": "purpose",
        "fishing": "purpose","traveling": "purpose","drinking": "purpose","quiet": "opinion","loud": "opinion","bright": "opinion","dark": "opinion","sharp": "opinion","smooth": "opinion","rough": "opinion",
        "clean": "opinion","dirty": "opinion","safe": "opinion","dangerous": "opinion","healthy": "opinion","thick": "size","thin": "size","heavy": "size","light": "size","shiny": "opinion","dull": "opinion","colorful": "opinion","plain": "opinion","classic": "age","fresh": "age","average": "size","ordinary": "opinion",
        "spherical": "shape",
        "flat": "shape",
        "multicolored": "color",
        "pastel": "color",
        "rustic": "origin",
        "urban": "origin",
        "synthetic": "material",
        "natural": "material",
        "durable": "opinion",
        "fragile": "opinion",
        "fashionable": "opinion",
        "stylish": "opinion",
        "elegant": "opinion",
        "casual": "opinion",
        "traditional": "origin",
        "contemporary": "origin",
        "functional": "purpose",
        "aesthetic": "purpose",
        "artistic": "purpose",
        "practical": "purpose",
        "innovative": "opinion",
        "creative": "opinion",
        "versatile": "opinion",
        "flexible": "opinion",
        "reliable": "opinion",
        "efficient": "opinion",
        "unique": "opinion",
        "common": "opinion",
        "subtle": "opinion",
        "bold": "opinion",
        "pleasant": "opinion",
        "unpleasant": "opinion",
        "mysterious": "opinion",
        "obvious": "opinion",
        "artificial": "origin",
        "organic": "material",
        "custom": "purpose",
        "impressive": "opinion",
        "delicate": "opinion",
        "adventurous": "opinion",
        "busy": "opinion",
        "serene": "opinion",
        "intense": "opinion",
        "dramatic": "opinion",
        "vibrant": "color",
        "muted": "color",
        "warm": "color",
        "cool": "color",
        "intense": "color",
        "neon": "color",
        "subdued": "color",
        "earthy": "color",
        "rich": "color",
        "pale": "color",
        "glossy": "opinion",
        "matte": "opinion",
        "sparkling": "opinion",
        "reflective": "opinion",
        "shimmering": "opinion",
        "glistening": "opinion",
        "rusty": "material",
        "oxidized": "material",

        "ancient": "age",

        "rustic": "origin",

        "pop": "color",

        "toasty": "color",

        "faded": "age",

        "worn": "age",

        "authentic": "origin",

        "ethereal": "opinion",

        "intuitive": "opinion",

        "insightful": "opinion",

        "thoughtful": "opinion",

        "humble": "opinion",

        "confident": "opinion",

        "brave": "opinion",

        "fierce": "opinion",

        "gentle": "opinion",

        "substantial": "size",

        "minimal": "size",

        "abstract": "shape",

        "concrete": "shape",
        "inspired": "opinion","chaotic": "opinion","cohesive": "opinion","systematic": "opinion","random": "opinion","balanced": "opinion","asymmetrical": "shape","symmetrical": "shape","translucent": "material","opaque": "material","colorful": "color","dynamic": "opinion",
        "static": "opinion","thrilling": "opinion","captivating": "opinion","moving": "opinion","heartwarming": "opinion","inspiring": "opinion","cheerful": "opinion","calm": "opinion","pensive": "opinion","uplifting": "opinion","nostalgic": "opinion","celebratory": "purpose","melancholic": "opinion","satisfying": "opinion","revitalizing": "opinion","refreshing": "opinion","stimulating": "opinion","motivating": "opinion",
        "enlightening": "opinion","entertaining": "purpose","educational": "purpose","instructive": "purpose","informative": "purpose","experimental": "purpose","interactive": "purpose","immersive": "purpose",
        "transformative": "opinion","realistic": "opinion","fantastical": "opinion","dreamlike": "opinion","surreal": "opinion","whimsical": "opinion","groundbreaking": "opinion","innovative": "opinion","revolutionary": "opinion",
        "trailblazing": "opinion","cutting-edge": "opinion","futuristic": "opinion","timeless": "opinion","pristine": "opinion","distressed": "material","handmade": "material","crafted": "material","bespoke": "material","eco-friendly": "origin","sustainable": "origin",
        "upcycled": "material","modernist": "origin","retro": "origin","avant-garde": "origin","experimental": "origin","neoclassical": "origin","gothic": "origin","baroque": "origin","rococo": "origin","rustic": "origin","industrial": "origin",
        "urban": "origin","naturalistic": "origin","traditional": "origin","primitive": "origin","tropical": "origin","arctic": "origin","desert": "origin","coastal": "origin","highland": "origin","mountainous": "origin","plain": "origin",
        "rough": "texture","smooth": "texture","silky": "texture","fuzzy": "texture","grainy": "texture",
        "textured": "texture","polished": "texture","glossy": "texture","roughened": "texture","velvety": "texture","hard": "texture","soft": "texture","sturdy": "texture","fragile": "texture","brittle": "texture","durable": "texture","flexible": "texture","rigid": "texture","pliable": "texture","elastic": "texture","heavy-duty": "texture","lightweight": "texture","foldable": "texture","collapsible": "texture",
        "expandable": "texture","compressible": "texture","insulated": "texture","weather-resistant": "texture","waterproof": "texture","breathable": "texture","flame-retardant": "texture","eco-friendly": "texture","biodegradable": "texture","non-toxic": "texture","recyclable": "texture","renewable": "texture","sustainable": "texture","carbon-neutral": "texture",
        "energy-efficient": "texture","low-impact": "texture","green": "texture","organic": "texture","chemical-free": "texture","artisanal": "texture","premium": "texture","budget-friendly": "texture","affordable": "texture","cost-effective": "texture",
        "value-added": "texture","luxurious": "texture","exclusive": "texture","elite": "texture","high-end": "texture","boutique": "texture","bespoke": "texture","tailored": "texture"
    }
    for noun in [token for token in doc if token.pos_ == "NOUN"]:
        adjectives = [token for token in noun.lefts if token.pos_ == "ADJ"]

        if len(adjectives) > 1:
                # Get the order of the adjectives according to the predefined categories
            adjective_categories = []
            for adj in adjectives:
                adj_category = adjective_mapping.get(adj.text.lower())
                if adj_category:
                    adjective_categories.append(adj_category)
                else:
                    print(f"Warning: No category found for adjective '{adj.text}'. It might not be mapped.")
                    suggestions.append(f"Warning: No category found for adjective '{adj.text}'. It might not be mapped.")

                # Check if the adjectives are in the correct order
            correct_order = sorted(adjective_categories, key=lambda x: adjective_order.index(x))

            if adjective_categories != correct_order:
                print(f"Error: Adjectives are in the wrong order in '{text}'.")
                suggestions.append(f"Error: Adjectives are in the wrong order in '{text}'.")
                adjective= True
                print(f"Correct order: {', '.join(correct_order)}")
                suggestions.append(f"Correct order: {', '.join(correct_order)}")
            else:
                print(f"Correct order: {', '.join(correct_order)}")
                suggestions.append(f"Correct order: {', '.join(correct_order)}")
    if adjective:
      errors= "adjective"
      return errors
    else:
      return "No error"

#SIMPLE PAST TENSE
def simple_past_tense(text):
    doc = nlp(text)
    tense = False
    suggestions = []

    # Simple past tense detection
    for token in doc:
        # Rule 1: Handling adverbs indicating past time
        if token.text in ["yesterday", "once", "previously", "past", "earlier", "ago", "last"]:
            for token in doc:
                if token.head.tag_ in ["VBP", "VBZ"]:
                    print(f"Error: Wrong Verb form is used in {token.head.text}")
                    suggestions.append(f"Error: Wrong Verb form is used in {token.head.text}")
                    tense = True
                    break
                if token.head.tag_ in ["VBN", "VB", "VBP", "VBZ"]:
                    print(f"Error: Do not use present perfect tense in place of simple past")
                    suggestions.append(f"Error: Do not use present perfect tense in place of simple past")
                    tense = True
                    break

        # Rule 2: Using "did" with past tense
        if token.text == "did":
            word = token.head.text
            word = nlp(word)
            for token in word:
                check_tense = token.tag_
                if check_tense in ["VBD", "VBN"]:
                    print("Error: Wrong verb form is used. When 'did' is used we have to use verb in base form")
                    suggestions.append("Error: Wrong verb form is used. When 'did' is used we have to use verb in base form")
                    tense = True

        # Rule 3: If negation is used, then use "did"
        if token.dep_ == "neg":
            for token in doc:
                if token.text != "did":
                    print("Error: While negation is used in simple past we have to use 'did'")
                    suggestions.append("Error: While negation is used in simple past we have to use 'did'")
                    tense = True
                    break

        # New Rule: Checking for mixed tenses in past and present
        if token.tag_ == "VBD" and token.head.tag_ == "VB" and "have" in [t.text for t in doc]:
            print("Error: Mixed tenses detected. Use simple past tense instead of present perfect.")
            suggestions.append("Error: Mixed tenses detected. Use simple past tense instead of present perfect.")
            tense = True

    if tense:
        errors = "tense"
        return errors
    else:
        return "No error"


#SIMPLE PRESENT TENSE
def simple_present_tense(text):
  doc = nlp(text)
  tense= False
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")
      if token.dep_ == "neg":
          for child in token.head.children:
              if token.head.text == "does" and child.tag_ != "VB":
                  print(f"Error: When using negation with 'does', the verb '{child.text}' must be in base form.")
                  suggestions.append(f"Error: When using negation with 'does', the verb '{child.text}' must be in base form.")
                  tense= True
                  break
      if token.dep_ == "nsubj" and token.text in ["he", "she", "it"]:
          for child in token.head.children:
              if child.pos_ == "VERB" and child.tag_ not in ["VBZ"]:
                  print(f"Error: The verb '{child.text}' should end with 's' or 'es' for third-person singular.")
                  suggestions.append(f"Error: The verb '{child.text}' should end with 's' or 'es' for third-person singular.")
                  tense= True
                  break

      # Rule 2: Incorrect use of "do/does" with verb form
      if token.text in ["do", "does"]:
          # Check if the verb following "does" is in base form
          if token.head.tag_ not in ["VB"]:
              print(f"Error: When using '{token.text}', the verb '{token.head.text}' should be in its base form.")
              suggestions.append(f"Error: When using '{token.text}', the verb '{token.head.text}' should be in its base form.")
              tense= True
      #Rule 1: Wrong Word Order in Questions
      if (token.text in ["do","does"]):
          list_pos=[]
          if token.head.tag_ in ["VBG","VBN","VBP","VBZ"]:
              print("Error: The main verb stays in its base form.")
              suggestions.append("Error: The main verb stays in its base form.")
              tense= True
          for token in doc:
              list_pos.append(token.dep_)
          if list_pos.index("nsubj") < list_pos.index("aux"):
              print("Error: the verb do/does comes before the subject")
              suggestions.append("Error: the verb do/does comes before the subject")
              tense= True
      #Rule 2: Mixing up "Has" and "Have"
      if (token.text.lower() in ["he","she","it"] or token.dep_ in ["nsubj","nsubjpass"]):
          if token.head.text == "have":
              print("Error: 'Has' must be used instead of 'have'")
              suggestions.append("Error: 'Has' must be used instead of 'have'")
              tense= True
      if (token.text.lower() in ["we","they","i"] ):
          if token.head.text == "has":
              print("Error: 'Have' must be used instead of 'Has'")
              suggestions.append("Error: 'Have' must be used instead of 'Has'")
              tense= True
    
    
  print(tense)
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#SIMPLE FUTURE TENSE
def simple_future_tense(text):
  doc = nlp(text)
  tense= False
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "will" is followed by a verb in base form
      if token.text == "will":
          # Get the head (verb) following "will"
          head_verb = token.head
          if head_verb.pos_ == "VERB" and head_verb.tag_ != "VB":
              print(f"Error: The verb '{head_verb.text}' after 'will' should be in base form (VB).")
              suggestions.append(f"Error: The verb '{head_verb.text}' after 'will' should be in base form (VB).")
              tense= True

      # Rule 2: Negation - "will not" or "won't" with base verb form
      if token.dep_ == "neg" and token.head.text == "will":
          # Check if the verb after "will not" is in base form
          for child in token.head.children:
              if child.dep_ == "xcomp" and child.pos_ == "VERB" and child.tag_ != "VB":
                  print(f"Error: When using negation with 'will', the verb '{child.text}' must be in base form.")
                  suggestions.append(f"Error: When using negation with 'will', the verb '{child.text}' must be in base form.")
                  tense= True
                  break

      # Rule 3: Ensure no past or present tense is used after "will"
      if token.text == "will":
          # Check if the head verb after "will" is in past or present tense
          head_verb = token.head
          if head_verb.tag_ in ["VBD", "VBZ", "VBP"]:
              print(f"Error: The verb '{head_verb.text}' should not be in the past or present tense after 'will'. Use base form instead.")
              suggestions.append(f"Error: The verb '{head_verb.text}' should not be in the past or present tense after 'will'. Use base form instead.")
              tense= True
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#PRESENT CONTINUOUS TENSE
def present_continous_tense(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in present continuous tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "am", "is", or "are" is followed by a verb in present participle (-ing) form
      if token.text in ["am", "is", "are"]:
          # Get the verb that follows the auxiliary verb
          for child in token.children:
              if child.dep_ == "xcomp" and child.pos_ == "VERB" and child.tag_ != "VBG":
                  print(f"Error: The verb '{child.text}' after '{token.text}' should be in the -ing form (present participle).")
                  suggestions.append(f"Error: The verb '{child.text}' after '{token.text}' should be in the -ing form (present participle).")
                  tense= True
                  break

      # Rule 2: Negation - Check if "am not", "is not", or "are not" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text in ["am", "is", "are"]:
          # Ensure the verb after negation is in the present participle form
          for child in token.head.children:
              if child.pos_ == "VERB" and child.tag_ != "VBG":
                  print(f"Error: When using negation with '{token.head.text}', the verb '{child.text}' must be in the -ing form.")
                  suggestions.append(f"Error: When using negation with '{token.head.text}', the verb '{child.text}' must be in the -ing form.")
                  tense= True
                  break

      # Rule 3: Ensure no past tense verbs are used in present continuous tense
      if token.text in ["am", "is", "are"]:
          # Get the verb that follows the auxiliary verb and ensure it's not in past tense
          for child in token.children:
              if child.pos_ == "VERB" and child.tag_ in ["VBD", "VBZ", "VBP"]:
                  print(f"Error: The verb '{child.text}' should not be in the past or present tense after '{token.text}'. Use the -ing form instead.")
                  suggestions.append(f"Error: The verb '{child.text}' should not be in the past or present tense after '{token.text}'. Use the -ing form instead.")
                  tense= True
                  break
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#PRESENT PERFECT TENSE
def present_perfect_tense(text):
  doc= nlp(text)
  tense= False
  # Define correct past participles for irregular verbs
  correct_participles = {
      "go": "gone",
      "do": "done",
      "eat": "eaten",
      "see": "seen",
      "write": "written",
      "speak": "spoken",
      "be": "been",
      "become": "become",
      "begin": "begun",
      "break": "broken",
      "bring": "brought",
      "build": "built",
      "buy": "bought",
      "choose": "chosen",
      "come": "come",
      "cost": "cost",
      "cut": "cut",
      "dig": "dug",
      "draw": "drawn",
      "drink": "drunk",
      "drive": "driven",
      "fall": "fallen",
      "feel": "felt",
      "fight": "fought",
      "find": "found",
      "fly": "flown",
      "forget": "forgotten",
      "forgive": "forgiven",
      "freeze": "frozen",
      "get": "gotten",
      "give": "given",
      "grow": "grown",
      "hang": "hung",
      "have": "had",
      "hear": "heard",
      "hide": "hidden",
      "hit": "hit",
      "hold": "held",
      "hurt": "hurt",
      "keep": "kept",
      "know": "known",
      "lead": "led",
      "leave": "left",
      "lend": "lent",
      "let": "let",
      "lose": "lost",
      "make": "made",
      "mean": "meant",
      "meet": "met",
      "pay": "paid",
      "put": "put",
      "read": "read",
      "ride": "ridden",
      "ring": "rung",
      "rise": "risen",
      "run": "run",
      "say": "said",
      "see": "seen",
      "sell": "sold",
      "send": "sent",
      "set": "set",
      "shake": "shaken",
      "shine": "shone",
      "shoot": "shot",
      "show": "shown",
      "shrink": "shrunk",
      "shut": "shut",
      "sing": "sung",
      "sit": "sat",
      "sleep": "slept",
      "speak": "spoken",
      "spend": "spent",
      "stand": "stood",
      "steal": "stolen",
      "stick": "stuck",
      "strike": "struck",
      "swear": "sworn",
      "swim": "swum",
      "take": "taken",
      "teach": "taught",
      "tear": "torn",
      "tell": "told",
      "think": "thought",
      "throw": "thrown",
      "understand": "understood",
      "wake": "woken",
      "wear": "worn",
      "win": "won",
      "write": "written",
      "lend": "lent",
      "fight": "fought",
      "lay": "laid",
      "send": "sent",
      "leave": "left",
      "light": "lit",
      "shut": "shut",
      "cost": "cost",
      "seek": "sought",
      "creep": "crept",
      "abide": "abided",
      "arise": "arisen",
      "awake": "awoken",
      "bear": "borne",
      "beat": "beaten",
      "beget": "begotten",
      "bend": "bent",
      "bet": "bet",
      "bid": "bidden",
      "bleed": "bled",
      "blow": "blown",
      "breed": "bred",
      "cling": "clung",
      "cost": "cost",
      "creep": "crept",
      "deal": "dealt",
      "dig": "dug",
      "dive": "dived",
      "dream": "dreamt",
      "dwell": "dwelt",
      "feed": "fed",
      "flee": "fled",
      "fling": "flung",
      "forsake": "forsaken",
      "grind": "ground",
      "kneel": "knelt",
      "lean": "leant",
      "leap": "leapt",
      "mislead": "misled",
      "mistake": "mistaken",
      "overtake": "overtaken",
      "plead": "pleaded",
      "prove": "proven",
      "quit": "quit",
      "ride": "ridden",
      "rid": "rid",
      "ring": "rung",
      "shed": "shed",
      "sling": "slung",
      "slide": "slid",
      "sneak": "snuck",
      "speed": "sped",
      "spit": "spat",
      "split": "split",
      "spring": "sprung",
      "sting": "stung",
      "stink": "stunk",
      "strike": "struck",
      "string": "strung",
      "thrust": "thrust",
      "tread": "trodden",
      "undergo": "undergone",
      "upset": "upset",
      "weave": "woven",
      "weep": "wept",
      "wind": "wound",
      "withdraw": "withdrawn",
      "wring": "wrung",
      "abide": "abided",
      "broadcast": "broadcast",
      "burst": "burst",
      "cast": "cast",
      "cut": "cut",
      "fit": "fit",
      "hurt": "hurt",
      "let": "let",
      "put": "put",
      "spread": "spread",
      "split": "split",
      "thrust": "thrust"
  }
  # Loop through the tokens to identify errors in present perfect tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "has" or "have" is followed by a verb in past participle (VBN) form
      if token.text in ["has", "have"]:
          head_verb = token.head

          # Check if the head of 'has/have' is a verb and whether it's in the past participle form
          if head_verb.pos_ == "VERB":
              print(f"Head verb: {head_verb.text} (POS: {head_verb.pos_}, Tag: {head_verb.tag_})")

              # Check if the verb is in the past participle form (VBN)
              if head_verb.tag_ != "VBN":
                  print(f"Error: The verb '{head_verb.text}' after '{token.text}' should be in the past participle form (VBN).")
                  suggestions.append(f"Error: The verb '{head_verb.text}' after '{token.text}' should be in the past participle form (VBN).")
                  tense= True

              # Check if the past participle is correct for irregular verbs
              elif head_verb.lemma_ in correct_participles and head_verb.text != correct_participles[head_verb.lemma_]:
                  print(f"Error: The verb '{head_verb.text}' should be '{correct_participles[head_verb.lemma_]}' after '{token.text}'.")
                  suggestions.append(f"Error: The verb '{head_verb.text}' should be '{correct_participles[head_verb.lemma_]}' after '{token.text}'.")
                  tense= True

      # Rule 2: Negation - Check if "has not" or "have not" is followed by a past participle verb
      if token.dep_ == "neg" and token.head.text in ["has", "have"]:
          # Ensure the verb after negation is in the past participle form
          for child in token.head.children:
              if child.pos_ == "VERB" and child.tag_ != "VBN":
                  print(f"Error: When using negation with '{token.head.text}', the verb '{child.text}' must be in the past participle form (VBN).")
                  suggestions.append(f"Error: When using negation with '{token.head.text}', the verb '{child.text}' must be in the past participle form (VBN).")
                  tense= True
                  break

      # Rule 3: Ensure no continuous or present tense verbs are used in present perfect tense
      if token.text in ["has", "have"]:
          # Check if the head verb after "has" or "have" is in continuous or simple present tense
          for child in token.children:
              if child.pos_ == "VERB" and child.tag_ in ["VB", "VBG", "VBZ", "VBP"]:
                  print(f"Error: The verb '{child.text}' should not be in present or continuous tense after '{token.text}'. Use the past participle form (VBN) instead.")
                  suggestions.append(f"Error: The verb '{child.text}' should not be in present or continuous tense after '{token.text}'. Use the past participle form (VBN) instead.")
                  tense= True
                  break
  if tense:
    errors= "tense"
    return errors
  else:
    return "No error"

#PRESENT PERFECT CONTINOUS TENSE
def present_perfect_continuous_tense(text):
  doc = nlp(text)
  tense= False
  errors=[]
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "has been" or "have been" is followed by a verb in present participle (VBG) form
      if token.text in ["has", "have"]:
          # Look for "been" in the same sentence
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "been":
                  # Check for the next verb after "been"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB":
                          # Check if the verb is in the present participle form (VBG)
                          if doc[j].tag_ != "VBG":
                              print(f"Error: The verb '{doc[j].text}' after '{token.text} {doc[i].text}' should be in the present participle form (VBG).")
                              suggestions.append(f"Error: The verb '{doc[j].text}' after '{token.text} {doc[i].text}' should be in the present participle form (VBG).")
                              tense= True
                          break
                  break

      # Rule 2: Negation - Check if "has not been" or "have not been" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text in ["has", "have"]:
          # Ensure the verb after "been" is in the present participle form
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].text == "been":
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ != "VBG":
                          print(f"Error: When using negation with '{token.head.text} not', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          suggestions.append(f"Error: When using negation with '{token.head.text} not', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          tense= True
                          break
                  break

      # Rule 3: Ensure no simple past or past participle verbs are used
      if token.text in ["has", "have"]:
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "been":
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ in ["VBD", "VBN"]:
                          print(f"Error: The verb '{doc[j].text}' should not be in past or past participle form after '{token.text} {doc[i].text}'. Use the present participle form (VBG) instead.")
                          suggestions.append(f"Error: The verb '{doc[j].text}' should not be in past or past participle form after '{token.text} {doc[i].text}'. Use the present participle form (VBG) instead.")
                          tense= True
                          break
                  break
  if tense:
    tense.append("tense")
    return errors
  else:
      return "No error"

#PAST CONTINUOUS TENSE
def past_continuous_tense(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in past continuous tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "was" or "were" is followed by a verb in present participle (VBG) form
      if token.text in ["was", "were"]:
          # Look for the verb that follows "was" or "were"
          for i in range(token.i + 1, len(doc)):
              if doc[i].pos_ == "VERB":
                  # Check if the verb is in the present participle form (VBG)
                  if doc[i].tag_ != "VBG":
                      print(f"Error: The verb '{doc[i].text}' after '{token.text}' should be in the present participle form (VBG).")
                      suggestions.append(f"Error: The verb '{doc[i].text}' after '{token.text}' should be in the present participle form (VBG).")
                      tense= True
                  break

      # Rule 2: Negation - Check if "was not" or "were not" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text in ["was", "were"]:
          # Ensure the verb after negation is in the present participle form
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].pos_ == "VERB" and doc[i].tag_ != "VBG":
                  print(f"Error: When using negation with '{token.head.text} not', the verb '{doc[i].text}' must be in the present participle form (VBG).")
                  suggestions.append(f"Error: When using negation with '{token.head.text} not', the verb '{doc[i].text}' must be in the present participle form (VBG).")
                  tense= True
                  break

      # Rule 3: Ensure no simple past or past participle verbs are used
      if token.text in ["was", "were"]:
          for i in range(token.i + 1, len(doc)):
              if doc[i].pos_ == "VERB" and doc[i].tag_ in ["VBD", "VBN"]:
                  print(f"Error: The verb '{doc[i].text}' should not be in past or past participle form after '{token.text}'. Use the present participle form (VBG) instead.")
                  suggestions.append(f"Error: The verb '{doc[i].text}' should not be in past or past participle form after '{token.text}'. Use the present participle form (VBG) instead.")
                  tense= True
                  break
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#PAST PERFECT TENSE
def past_perfect_tense(text):
    doc = nlp(text)
    tense = False
    time_conjunctions = {"before", "after", "when", "as soon as", "by the time"}
    
    for token in doc:
        # Rule 1: "had" must be followed by a verb in past participle (VBN)
        if token.text == "had":
            for i in range(token.i + 1, len(doc)):
                if doc[i].pos_ == "VERB" and doc[i].tag_ != "VBN":
                    print(f"Error: The verb '{doc[i].text}' after '{token.text}' should be in the past participle form (VBN).")
                    suggestions.append(f"Error: The verb '{doc[i].text}' after '{token.text}' should be in the past participle form (VBN).")
                    tense = True
                break
        
        # Rule 2: Negation - "had not" must be followed by a past participle verb
        if token.dep_ == "neg" and token.head.text == "had":
            for i in range(token.head.i + 1, len(doc)):
                if doc[i].pos_ == "VERB" and doc[i].tag_ != "VBN":
                    print(f"Error: When using negation with '{token.head.text} not', the verb '{doc[i].text}' must be in the past participle form (VBN).")
                    suggestions.append(f"Error: When using negation with '{token.head.text} not', the verb '{doc[i].text}' must be in the past participle form (VBN).")
                    tense = True
                break
        
        # Rule 3: Ensure no present or continuous verbs in past perfect tense
        if token.text == "had":
            for i in range(token.i + 1, len(doc)):
                if doc[i].pos_ == "VERB" and doc[i].tag_ in ["VB", "VBG", "VBZ", "VBP"]:
                    print(f"Error: The verb '{doc[i].text}' should not be in present or continuous form after '{token.text}'. Use the past participle form (VBN) instead.")
                    suggestions.append(f"Error: The verb '{doc[i].text}' should not be in present or continuous form after '{token.text}'. Use the past participle form (VBN) instead.")
                    tense = True
                break

        # Rule 4: Tense consistency with time conjunctions
        if token.text.lower() in time_conjunctions:
            prev_verb = None
            next_verb = None
            for left in token.lefts:
                if left.pos_ == "VERB":
                    prev_verb = left
            for right in token.rights:
                if right.pos_ == "VERB":
                    next_verb = right
            if prev_verb and next_verb:
                # Check if earlier action doesn't use past perfect
                if prev_verb.tag_ not in ["VBN"] and next_verb.tag_ in ["VBD"]:
                    print(f"Error: The earlier action '{prev_verb.text}' should use past perfect tense.")
                    suggestions.append(f"Error: The earlier action '{prev_verb.text}' should use past perfect tense.")
                    tense = True
                # Check if later action incorrectly uses present perfect
                if prev_verb.tag_ in ["VBD"] and next_verb.tag_ in ["VBN"] and next_verb.head.text != "had":
                    print(f"Error: The later action '{next_verb.text}' should not use present perfect tense.")
                    suggestions.append(f"Error: The later action '{next_verb.text}' should not use present perfect tense.")
                    tense = True    

    if tense:
        errors= "tense"
        return errors
    else:
        return "No error"

#PAST PERFECT CONTINUOUS
def past_perfect_continuous(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in past perfect continuous tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "had been" is followed by a verb in the present participle (VBG) form
      if token.text == "had":
          # Look for "been" after "had"
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "been":
                  # Look for the verb after "been"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB":
                          # Check if the verb is in the present participle form (VBG)
                          if doc[j].tag_ != "VBG":
                              print(f"Error: The verb '{doc[j].text}' after '{token.text} been' should be in the present participle form (VBG).")
                              suggestions.append(f"Error: The verb '{doc[j].text}' after '{token.text} been' should be in the present participle form (VBG).")
                              tense= True
                          break
                  break

      # Rule 2: Negation - Check if "had not been" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text == "had":
          # Look for "been" after "had not"
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].text == "been":
                  # Look for the verb after "been"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ != "VBG":
                          print(f"Error: When using negation with '{token.head.text} not been', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          suggestions.append(f"Error: When using negation with '{token.head.text} not been', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          tense= True
                          break
                  break

      # Rule 3: Ensure no past or present tense verbs are used in past perfect continuous tense
      if token.text == "had":
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "been":
                  # Check for incorrect verb forms after "been"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ in ["VBD", "VBN", "VB", "VBZ"]:
                          print(f"Error: The verb '{doc[j].text}' should not be in past or simple present tense after 'had been'. Use the present participle form (VBG) instead.")
                          suggestions.append(f"Error: The verb '{doc[j].text}' should not be in past or simple present tense after 'had been'. Use the present participle form (VBG) instead.")
                          tense= True
                          break
                  break
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#FUTURE CONTINUOUS
def future_continuous(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in future continuous tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "will be" is followed by a verb in the present participle (VBG) form
      if token.text == "will":
          # Look for "be" after "will"
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "be":
                  # Look for the verb after "be"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB":
                          # Check if the verb is in the present participle form (VBG)
                          if doc[j].tag_ != "VBG":
                              print(f"Error: The verb '{doc[j].text}' after '{token.text} be' should be in the present participle form (VBG).")
                              suggestions.append(f"Error: The verb '{doc[j].text}' after '{token.text} be' should be in the present participle form (VBG).")
                              tense= True
                          break
                  break

      # Rule 2: Negation - Check if "will not be" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text == "will":
          # Look for "be" after "will not"
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].text == "be":
                  # Look for the verb after "be"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ != "VBG":
                          print(f"Error: When using negation with '{token.head.text} not be', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          suggestions.append(f"Error: When using negation with '{token.head.text} not be', the verb '{doc[j].text}' must be in the present participle form (VBG).")
                          tense= True
                          break
                  break

      # Rule 3: Ensure no past or present tense verbs are used in future continuous tense
      if token.text == "will":
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "be":
                  # Check for incorrect verb forms after "be"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ in ["VBD", "VBN", "VB", "VBZ"]:
                          print(f"Error: The verb '{doc[j].text}' should not be in past or simple present tense after 'will be'. Use the present participle form (VBG) instead.")
                          suggestions.append(f"Error: The verb '{doc[j].text}' should not be in past or simple present tense after 'will be'. Use the present participle form (VBG) instead.")
                          tense= True
                          break
                  break
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#FUTURE PERFECT TENSE
def future_perfect_tense(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in future perfect tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "will have" is followed by a verb in the past participle (VBN) form
      if token.text == "will":
          # Look for "have" after "will"
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "have":
                  # Look for the verb after "have"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB":
                          # Check if the verb is in the past participle form (VBN)
                          if doc[j].tag_ != "VBN":
                              print(f"Error: The verb '{doc[j].text}' after 'will have' should be in the past participle form (VBN).")
                              suggestions.append(f"Error: The verb '{doc[j].text}' after 'will have' should be in the past participle form (VBN).")
                              tense= True
                          break
                  break

      # Rule 2: Negation - Check if "will not have" is followed by a past participle verb
      if token.dep_ == "neg" and token.head.text == "will":
          # Look for "have" after "will not"
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].text == "have":
                  # Look for the verb after "have"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ != "VBN":
                          print(f"Error: When using negation with 'will not have', the verb '{doc[j].text}' must be in the past participle form (VBN).")
                          suggestions.append(f"Error: When using negation with 'will not have', the verb '{doc[j].text}' must be in the past participle form (VBN).")
                          tense= True
                          break
                  break

      # Rule 3: Ensure no present or continuous tense verbs are used in future perfect tense
      if token.text == "will":
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "have":
                  # Look for incorrect verb forms after "have"
                  for j in range(i + 1, len(doc)):
                      if doc[j].pos_ == "VERB" and doc[j].tag_ in ["VB", "VBZ", "VBG"]:
                          print(f"Error: The verb '{doc[j].text}' should not be in present or continuous tense after 'will have'. Use the past participle form (VBN) instead.")
                          suggestions.append(f"Error: The verb '{doc[j].text}' should not be in present or continuous tense after 'will have'. Use the past participle form (VBN) instead.")
                          tense= True
                          break
                  break

      # Rule 4: Ensure "have" is used instead of "had" or any other past form of "have"
      if token.text == "will":
          for i in range(token.i + 1, len(doc)):
              if doc[i].text != "have":
                  print(f"Error: The word '{doc[i].text}' should not be used after 'will'. Use 'have' instead.")
                  suggestions.append(f"Error: The word '{doc[i].text}' should not be used after 'will'. Use 'have' instead.")
                  tense= True
                  break

  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#FUTURE PERFECT CONTINUOUS TENSE
def future_present_continuous_tense(text):
  doc = nlp(text)
  tense= False
  # Loop through the tokens to identify errors in future perfect continuous tense
  for token in doc:
      # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

      # Rule 1: Check if "will have been" is followed by a verb in the present participle (VBG) form
      if token.text == "will":
          # Look for "have" after "will"
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "have":
                  # Look for "been" after "have"
                  for j in range(i + 1, len(doc)):
                      if doc[j].text == "been":
                          # Check if "been" is followed by a verb in the present participle form (VBG)
                          for k in range(j + 1, len(doc)):
                              if doc[k].pos_ == "VERB":
                                  if doc[k].tag_ != "VBG":
                                      print(f"Error: The verb '{doc[k].text}' after 'will have been' should be in the present participle form (VBG).")
                                      suggestions.append(f"Error: The verb '{doc[k].text}' after 'will have been' should be in the present participle form (VBG).")
                                      tense= True
                                  break
                          break
                  break

      # Rule 2: Negation - Check if "will not have been" is followed by a present participle verb
      if token.dep_ == "neg" and token.head.text == "will":
          # Look for "have" after "will not"
          for i in range(token.head.i + 1, len(doc)):
              if doc[i].text == "have":
                  # Look for "been" after "have"
                  for j in range(i + 1, len(doc)):
                      if doc[j].text == "been":
                          # Check if "been" is followed by a verb in the present participle form
                          for k in range(j + 1, len(doc)):
                              if doc[k].pos_ == "VERB" and doc[k].tag_ != "VBG":
                                  print(f"Error: When using negation with 'will not have been', the verb '{doc[k].text}' must be in the present participle form (VBG).")
                                  suggestions.append(f"Error: When using negation with 'will not have been', the verb '{doc[k].text}' must be in the present participle form (VBG).")
                                  tense= True
                                  break
                          break
                  break

      # Rule 3: Ensure no past or present tense verbs are used in future perfect continuous tense
      if token.text == "will":
          for i in range(token.i + 1, len(doc)):
              if doc[i].text == "have":
                  for j in range(i + 1, len(doc)):
                      if doc[j].text == "been":
                          for k in range(j + 1, len(doc)):
                              if doc[k].pos_ == "VERB" and doc[k].tag_ in ["VBD", "VBN", "VB", "VBZ"]:
                                  print(f"Error: The verb '{doc[k].text}' should not be in past or simple present tense after 'will have been'. Use the present participle form (VBG) instead.")
                                  suggestions.append(f"Error: The verb '{doc[k].text}' should not be in past or simple present tense after 'will have been'. Use the present participle form (VBG) instead.")
                                  tense= True
                                  break
                          break
                  break
  if tense:
    errors= "tense"
    return errors
  else:
      return "No error"

#ACTIVE AND PASSIVE VOICE

def check_voices(text):
    doc = nlp(text)
    active= False
    passive= False
    # Loop through the tokens to identify active and passive voice
    for token in doc:
        # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

        # Rule 1: Check for passive voice: Look for auxiliary verb ("be" forms) followed by a past participle (VBN)
        if token.text in ["is", "was", "were", "are", "been", "being", "am", "be", "has", "have"] and token.dep_ == "auxpass":
            # Check if the following verb is in past participle (VBN)
            head_index = token.head.i
            if head_index + 1 < len(doc) and doc[head_index + 1].tag_ == "VBN":
                print("This sentence is in passive voice.")
                suggestions.append("This sentence is in passive voice.")
                passive = True

        # Rule 2: Check for active voice: The subject should directly be connected to the verb
        if token.dep_ == "nsubj" and token.head.pos_ == "VERB":
            # If the verb is not followed by a past participle or an auxiliary verb
            head_index = token.head.i
            if head_index + 1 < len(doc) and doc[head_index + 1].tag_ != "VBN":
                print("This sentence is in active voice.")
                suggestions.append("This sentence is in active voice.")
                active = True
    if active:
      return "active"
    else:
      return "passive"

#Prepositions
def check_prepositions(text):
    doc = nlp(text)
    preposition = False
    correct_prepositions = {
        "interested": ["in"],"focus": ["on"],"depend": ["on"],"good": ["at"],"look": ["at", "for"],"participate": ["in"],"responsible": ["for"],"work": ["on", "with"],"afraid": ["of"],"worried": ["about"],
        "learning":["about","from"],"accustomed": ["to"],"addicted": ["to"],"agree": ["with", "to", "on"],"apologize": ["for", "to"],"approve": ["of"],"argue": ["with", "about"],"arrive": ["at", "in"],"ask": ["for"],"aware": ["of"],
        "believe": ["in"],"belong": ["to"],"blame": ["for", "on"],"boast": ["about"],"borrow": ["from"],"capable": ["of"],"care": ["about", "for"],"collaborate": ["with", "on"],"comment": ["on"],"complain": ["about", "to"],
        "concentrate": ["on"],"congratulate": ["on"],"consist": ["of"],"contribute": ["to"],"cope": ["with"],"deal": ["with"],"dedicate": ["to"],"depend": ["on"],"devote": ["to"],"differ": ["from", "with"],"disagree": ["with"],"dream": ["about", "of"],"escape": ["from"],"excel": ["in", "at"],"excited": ["about"],
        "explain": ["to"],"famous": ["for"],"fight": ["for", "with", "against"],"fill": ["with"],"forgive": ["for"],"friendly": ["with", "to"],"frightened": ["of", "by"],"glance": ["at"],"grateful": ["for", "to"],"guilty": ["of"],"hope": ["for"],"impose": ["on"],"impressed": ["with", "by"],"insist": ["on"],
        "interfere": ["with", "in"],"invest": ["in"],"invite": ["to"],"involved": ["in", "with"],"jealous": ["of"],"keen": ["on"],"laugh": ["at"],"listen": ["to"],"live": ["on", "in"],"look": ["after", "into"],"married": ["to"],"object": ["to"],
        "pay": ["for"],"prefer": ["to"],"prepare": ["for"],"prevent": ["from"],"provide": ["for", "with"],"recover": ["from"],"rely": ["on"],"remind": ["of"],"reply": ["to"],"respect": ["for"],"responsible": ["for"],"result": ["in"],"search": ["for"],"shout": ["at", "to"],"specialize": ["in"],"spend": ["on"],
        "succeed": ["in"],"suffer": ["from"],"talk": ["about", "to", "with"],"thank": ["for"],"think": ["about", "of"],"tired": ["of"],"translate": ["into"],"trust": ["in"],"wait": ["for"],"warn": ["about"],"worry": ["about"],"wonder": ["about"],
        "write": ["about", "to"],"zealous": ["for"],"accuse": ["of"],"adapt": ["to"],"admit": ["to"],"care": ["about"],"charge": ["with"],"decide": ["on", "about"],"differ": ["from"],"depend": ["on"],"laugh": ["at"],
        "apply": ["for", "to"],"apologize": ["to", "for"],"approve": ["of"],"argue": ["about", "with"],"arrange": ["for"],"ask": ["for", "about"],"associate": ["with"],"benefit": ["from"],"belong": ["to"],
        "blame": ["for"],"borrow": ["from"],"care": ["about", "for"],"charge": ["with"],"choose": ["between"],"collide": ["with"],"compare": ["with", "to"],"compete": ["with", "against"],"complain": ["about"],"composed": ["of"],"confide": ["in"],"confuse": ["with"],"consist": ["of"],
        "contribute": ["to"],"count": ["on"],"crash": ["into"],"deal": ["with", "in"],"decide": ["on"],"depend": ["on"],"deprive": ["of"],"derive": ["from"],"deter": ["from"],"devote": ["to"],
        "differ": ["from"],"disapprove": ["of"],"discourage": ["from"],"distinguish": ["between"],"dream": ["about", "of"],"escape": ["from"],"excuse": ["for"],"exempt": ["from"],"explain": ["to"],"focus": ["on"],"forgive": ["for"],"hope": ["for"],"identify": ["with"],"insist": ["on"],
        "interfere": ["with"],"introduce": ["to"],"invest": ["in"],"involve": ["in"],"laugh": ["at"],"lead": ["to"],"listen": ["to"],"long": ["for"],"mistake": ["for"],"object": ["to"],"participate": ["in"],
        "pay": ["for"],"plan": ["on"],"prefer": ["to"],"prevent": ["from"],"prohibit": ["from"],"provide": ["for"],"recover": ["from"],"refer": ["to"],"rely": ["on"],"remind": ["of"],"resign": ["from"],"result": ["in"],"succeed": ["in"],
        "suffer": ["from"],"suspect": ["of"],"take": ["after"],"talk": ["about"],"thank": ["for"],"think": ["about", "of"],"translate": ["into"],"trust": ["with"],"warn": ["about"],"work": ["on", "with"],"worry": ["about"],"account": ["for"],"adapt": ["to"],"adjust": ["to"],
        "admit": ["to"],"agree": ["on", "with"],"aim": ["at"],"apologize": ["for"],"apply": ["to", "for"],"arrange": ["for"],"base": ["on"],"believe": ["in"],"benefit": ["from"],"care": ["for"],"charge": ["with"],"collaborate": ["with"],"concentrate": ["on"],"confuse": ["with"]
    }

    for token in doc:
        # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

        # Rule 1: Identify prepositions and check their usage
        if token.pos_ == "ADP" and token.dep_ == "prep":
            # Get the head of the preposition (the word it is modifying)
            head_word = token.head.text.lower()

            # Check if the head word has a specific preposition requirement
            if head_word in correct_prepositions:
                # If the preposition is not in the list of correct prepositions for this head word, flag an error
                if token.text not in correct_prepositions[head_word]:
                    print(f"Error: Incorrect preposition '{token.text}' used with '{head_word}'. Expected: {correct_prepositions[head_word]}")
                    suggestions.append(f"Error: Incorrect preposition '{token.text}' used with '{head_word}'. Expected: {correct_prepositions[head_word]}")
                    preposition = True

            # If head word is not found in the dictionary, print a warning
            else:
                print(f"Warning: No preposition rule defined for '{head_word}'.")

    # Rule 2: Check for missing prepositions (where a preposition is expected but not present)
    for token in doc:
        if token.text.lower() in correct_prepositions:
            # Look for a preposition related to the word, using its head relationships
            has_preposition = any(t.dep_ == "prep" and t.head == token for t in doc)

            # If the word requires a preposition but none is found, flag an error
            if not has_preposition:
                expected_preps = correct_prepositions[token.text.lower()]
                print(f"Error: The word '{token.text}' requires a preposition. Expected: {expected_preps}, but none was found.")
                suggestions.append(f"Error: The word '{token.text}' requires a preposition. Expected: {expected_preps}, but none was found.")
                preposition = True
    if preposition:
      errors= "preposition"
      return errors
    else:
      return "No error"

#articles

def check_articles(text):
    article= False
    doc = nlp(text)
    # Define a set of vowels and consonants
    vowel_sounds = {"a", "e", "i", "o", "u"}
    correct_articles = {"a", "an", "the"}

    # Loop through tokens to identify articles and check their usage
    for token in doc:
        # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

        # Rule 1: Identify articles ("a", "an", "the")
        if token.text in correct_articles:
            # Get the word following the article (i.e., the noun or adjective modifying the noun)
            next_token = token.nbor(1)

            # Rule 2: Check if "a" or "an" is used correctly based on the next word's sound
            if token.text == "a":
                # If next word starts with a vowel sound, "a" is incorrect
                if next_token.text[0].lower() in vowel_sounds:
                    print(f"Error: Incorrect use of 'a' before '{next_token.text}'. Use 'an' instead.")
                    suggestions.append(f"Error: Incorrect use of 'a' before '{next_token.text}'. Use 'an' instead.")
                    article = True
            elif token.text == "an":
                # If next word starts with a consonant sound, "an" is incorrect
                if next_token.text[0].lower() not in vowel_sounds:
                    print(f"Error: Incorrect use of 'an' before '{next_token.text}'. Use 'a' instead.")
                    suggestions.append(f"Error: Incorrect use of 'an' before '{next_token.text}'. Use 'a' instead.")
                    article = True
            # Rule 3: Check if "the" is used properly (basic check for now)
            # More complex rules for "the" can be added depending on the context
            # elif token.text == "the":
            #     # You can add more complex logic here, such as checking if the noun has been mentioned earlier
            #     print(f"'The' is used, but no specific validation is applied in this simple example.")
            #     # suggestions.append(f"'The' is used, but no specific validation is applied in this simple example.")
            #     article = True

    # # Rule 4: Check if nouns require articles but are missing them (e.g., "apple" without "an apple")
    # for token in doc:
    #     if token.pos_ == "NOUN" and token.dep_ != "pobj":
    #         # Check if the noun has an article before it
    #         if not any(child.dep_ == "det" for child in token.children):
    #             print(f"Error: The noun '{token.text}' requires an article.")
    #             suggestions.append(f"Error: The noun '{token.text}' requires an article.")
    #             article = True
    if article:
      errors= "article"
      return errors
    else:
      return "No error"

def check_auxiliary(text):

    doc = nlp(text)
    auxiliary_verb_errors = []
    collective_nouns = ["team", "group", "family", "class", "committee", "audience", "staff"]
    auxiliary= False
    for token in doc:
        # print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")
        # Rule 1: Check if the auxiliary verb (AUX) is correctly used with the subject and verb tense
        if token.pos_ == "AUX":
            subject = None
            verb = None

            # Find the subject for the auxiliary verb
            for possible_subject in doc:
                if possible_subject.dep_ == "nsubj" and possible_subject.head == token.head:
                    subject = possible_subject
                    break

            # Find the main verb for the auxiliary verb
            for possible_verb in doc:
                if possible_verb.head == token and possible_verb.pos_ == "VERB":
                    verb = possible_verb
                    break

            # Rule 1.1: If the auxiliary verb is "do", ensure it agrees with the subject (he/she/it -> "does")
            if token.text in ["do", "does"]:
                if subject and subject.tag_ == "PRP" and subject.text.lower() in ["he", "she", "it"] and token.text == "do":
                    auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'does', not 'do'.")
                    suggestions.append(f"Error: '{subject.text}' should use 'does', not 'do'.")
                    auxiliary=True

            # Rule 1.2: Ensure correct usage of "have/has" in present perfect tense
            if token.text in ["has", "have"]:
                if subject and subject.tag_ == "PRP" and subject.text.lower() in ["he", "she", "it"] and token.text == "have":
                    auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'has', not 'have'.")
                    suggestions.append(f"Error: '{subject.text}' should use 'has', not 'have'.")
                    auxiliary=True
                elif subject and subject.tag_ == "PRP" and subject.text.lower() not in ["he", "she", "it"] and token.text == "has":
                    auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'have', not 'has'.")
                    suggestions.append(f"Error: '{subject.text}' should use 'have', not 'has'.")
                    auxiliary=True

            # Rule 1.3: Ensure the correct verb form follows auxiliary verbs (e.g., present tense for "do/does")
            if verb and token.text in ["do", "does"]:
                if verb.tag_ != "VB":  # Expect base form verb (VB) after "do/does"
                    auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}'.")
                    suggestions.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}'.")
                    auxiliary=True

            # Rule 1.4: Ensure correct use of auxiliary verbs with continuous/progressive tense (e.g., "is/are" with "VBG")
            if verb and token.text in ["is", "are", "was", "were"]:
                if verb.tag_ != "VBG":  # Expect gerund verb (VBG) after "is/are/was/were"
                    auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in -ing form after '{token.text}'.")
                    suggestions.append(f"Error: The verb '{verb.text}' should be in -ing form after '{token.text}'.")
                    auxiliary=True
            # Rule 1.5: Ensure modal verbs are followed by a base form (VB) verb
            if token.text in ["can", "could", "may", "might", "shall", "should", "will", "would", "must"]:
                if verb and verb.tag_ != "VB":  # Expect base form after modal verbs
                    auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}'.")
                    suggestions.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}'.")
                    auxiliary=True
            # Rule 1.6: Ensure "has been", "have been", or "had been" is followed by a gerund form verb (VBG)
            if token.text in ["has", "have", "had"] and token.head.text == "been":
                if verb and verb.tag_ != "VBG":  # Expect gerund form after "been"
                    auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in gerund form (-ing) after 'been'.")
                    suggestions.append(f"Error: The verb '{verb.text}' should be in gerund form (-ing) after 'been'.")
                    auxiliary=True
            # Rule 1.7: Ensure "had" is followed by a past participle (VBN) verb in past perfect tense
            if token.text == "had" and verb and verb.tag_ != "VBN":  # Expect past participle after "had"
                auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in past participle form after 'had'.")
                suggestions.append(f"Error: The verb '{verb.text}' should be in past participle form after 'had'.")
                auxiliary=True
            # Rule 1.8: Ensure passive voice construction (is/are/was/were) is followed by a past participle (VBN)
            if token.text in ["is", "are", "was", "were"] and verb and verb.tag_ != "VBN":  # Expect past participle after "is/are/was/were"
                auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in past participle form after '{token.text}'.")
                suggestions.append(f"Error: The verb '{verb.text}' should be in past participle form after '{token.text}'.")
                auxiliary=True
            # Rule 1.9: Ensure "will" is followed by a base form (VB) verb in future tense
            if token.text == "will" and verb and verb.tag_ != "VB":  # Expect base form after "will"
                auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in base form after 'will'.")
                suggestions.append(f"Error: The verb '{verb.text}' should be in base form after 'will'.")
                auxiliary=True

            # Rule 1.10: Ensure "to have" is followed by a past participle (VBN) verb in perfect infinitives
            if token.text == "have" and token.head.text == "to" and verb and verb.tag_ != "VBN":  # Expect past participle after "to have"
                auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in past participle form after 'to have'.")
                suggestions.append(f"Error: The verb '{verb.text}' should be in past participle form after 'to have'.")
                auxiliary=True
            # Rule 1.11: Ensure proper use of auxiliary verbs in conditional sentences
            if token.dep_ == "mark" and token.text == "if":
                # Check for appropriate auxiliary verb usage in conditional clauses
                for token in doc:
                    if token.text in ["would", "could", "should"]:
                        if verb and verb.tag_ != "VB":  # Expect base form after conditional auxiliary verbs
                            auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}' in a conditional sentence.")
                            suggestions.append(f"Error: The verb '{verb.text}' should be in base form after '{token.text}' in a conditional sentence.")
                            auxiliary=True
            # Rule 1.12: Ensure auxiliary verbs with negation are paired with the correct main verb
            if token.dep_ == "neg" and token.head.pos_ == "AUX":
                if verb and verb.tag_ not in ["VB", "VBN", "VBG"]:
                    auxiliary_verb_errors.append(f"Error: The verb '{verb.text}' after '{token.head.text} not' is incorrect. Check tense and form.")
                    suggestions.append(f"Error: The verb '{verb.text}' after '{token.head.text} not' is incorrect. Check tense and form.")
                    auxiliary=True
            # Rule 1.13: Ensure imperatives use base form auxiliary verbs when there's no subject
            if not any(token.dep_ == "nsubj" for token in doc):  # No subject present
                if token.pos_ == "AUX" and token.tag_ != "VB":
                    auxiliary_verb_errors.append(f"Error: Imperative should use base form auxiliary verbs like 'do' or 'be'.")
                    suggestions.append(f"Error: Imperative should use base form auxiliary verbs like 'do' or 'be'.")
                    auxiliary=True

            # Rule 1.14: Ensure auxiliary verb agrees with the subject in singular/plural form
            if subject:
                # Special handling for collective nouns
                if subject.text.lower() in collective_nouns:
                    # Treat collective nouns as singular (e.g., "team is", not "team are")
                    if token.text == "are":
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'is', not 'are'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'is', not 'are'.")
                        auxiliary=True
                    elif token.text == "were":
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'was', not 'were'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'was', not 'were'.")
                        auxiliary=True
                else:
                    # General subject-verb agreement rules for singular/plural subjects
                    if token.text in ["is", "was"] and subject.tag_ == "PRP" and subject.text.lower() in ["we", "they"]:
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'are' or 'were', not '{token.text}'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'are' or 'were', not '{token.text}'.")
                        auxiliary=True
                    elif token.text in ["are", "were"] and subject.tag_ == "PRP" and subject.text.lower() in ["he", "she", "it"]:
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'is' or 'was', not '{token.text}'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'is' or 'was', not '{token.text}'.")
                        auxiliary=True
                    # Additional check for noun subjects (like team, group)
                    elif token.text in ["is", "was"] and subject.tag_ == "NNS":  # Plural noun
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'are' or 'were', not '{token.text}'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'are' or 'were', not '{token.text}'.")
                        auxiliary=True
                    elif token.text in ["are", "were"] and subject.tag_ == "NN":  # Singular noun
                        auxiliary_verb_errors.append(f"Error: '{subject.text}' should use 'is' or 'was', not '{token.text}'.")
                        suggestions.append(f"Error: '{subject.text}' should use 'is' or 'was', not '{token.text}'.")
                        auxiliary=True


    # Output the detected errors
    if auxiliary_verb_errors:
        for error in auxiliary_verb_errors:
            print(error)
    else:
        print("No auxiliary verb errors found.")
    print(auxiliary)
    if auxiliary:
      errors= "auxiliary"
      return errors
    else:
      return "No error"

#CONJUCTIONS
def check_conjuction(text):
    doc = nlp(text)
    conjuction= False
    arr_nouns= []
    i=0
    for token in doc:
        print(f"Token: {token.text}, POS: {token.pos_}, Tag: {token.tag_}, Dep: {token.dep_}, Head: {token.head.text}")

        # Rule 1: Check where Nouns are used continuously and see whether any conjuctions is required or not
        if token.pos_ == "NOUN":
            arr_nouns.append(token)  # Add noun to the list

            # Check if the previous token was also a noun
            if i > 0 and doc[i - 1].pos_ == "NOUN":
                print(f"Error: The nouns '{doc[i - 1].text}' and '{token.text}' are consecutive. A conjunction may be required.")
                suggestions.append(f"Error: The nouns '{doc[i - 1].text}' and '{token.text}' are consecutive. A conjunction may be required.")
                conjuction= True

        # Rule 2: Reset the list if a conjunction is used between nouns
        if token.pos_ == "CCONJ" or token.pos_ == "PUNCT":
            arr_nouns = []  # Reset the list if conjunction or punctuation is found

        i += 1

    # After processing all tokens, check if there were multiple nouns listed without a conjunction
    if len(arr_nouns) > 1:
        print(f"Error: The nouns {', '.join([noun.text for noun in arr_nouns])} are consecutive without conjunctions.")
        suggestions.append(f"Error: The nouns {', '.join([noun.text for noun in arr_nouns])} are consecutive without conjunctions.")
        conjuction= True

    if conjuction:
      errors= "conjuction"
      return errors
    else:
      return "No error"


"""Process the Sentence"""

# def identify_errors(text):
#     doc = nlp(text)
#     # Initialize flags to track verb tenses/aspects
#     simple_present_flag = False
#     present_perfect_flag = False
#     present_continuous_flag = False
#     future_continuous_flag = False
#     simple_future_flag = False
#     future_perfect_flag = False
#     past_continuous_flag = False
#     past_perfect_flag = False
#     past_perfect_continuous_flag = False
#     simple_past_flag = False
    
#     for token in doc:
#         # Check for Present Tenses
#         if token.tag_ in ['VB', 'VBP', 'VBZ']:
#             simple_present_flag = True
#         elif token.tag_ == 'VBN' and (token.dep_ == 'aux' and token.text in ['has', 'have']):
#             present_perfect_flag = True
#         elif token.tag_ == 'VBG' and (token.dep_ == 'aux' and token.text in ['am', 'is', 'are']):
#             present_continuous_flag = True
        
#         # Check for Future Tenses
#         elif token.tag_ == 'VBG' and (token.dep_ == 'aux' and token.text in ['will', 'shall']):
#             future_continuous_flag = True
#         elif token.text in ['will', 'shall'] and token.tag_ == 'VB':
#             simple_future_flag = True
#         elif token.tag_ == 'VBN' and token.dep_ == 'aux' and token.text in ['will', 'shall']:
#             future_perfect_flag = True

#         # Check for Past Tenses
#         elif token.tag_ == 'VBN' and token.dep_ == 'aux' and token.text == 'had':
#             past_perfect_flag = True
#         elif token.tag_ == 'VBG' and token.dep_ == 'aux' and token.text == 'had':
#             past_perfect_continuous_flag = True
#         elif token.tag_ == 'VBG' and token.dep_ == 'aux' and token.text in ['was', 'were']:
#             past_continuous_flag = True
#         elif token.tag_ == 'VBD':
#             simple_past_flag = True

#     error_list = []

#     # Prioritize more specific tense checks
#     if past_perfect_flag or past_perfect_continuous_flag:
#         if past_perfect_flag:
#             print("Past Perfect Tense detected:")
#             error_list.append(past_perfect_tense(text))
#         if past_perfect_continuous_flag:
#             print("Past Perfect Continuous Tense detected:")
#             error_list.append(past_perfect_continuous(text))
#     elif past_continuous_flag:
#         print("Past Continuous Tense detected:")
#         error_list.append(past_continuous_tense(text))
#     elif simple_past_flag:
#         print("Simple Past Tense detected:")
#         error_list.append(simple_past_tense(text))
    
#     # Check other tenses
#     if simple_present_flag:
#         print("Simple Present Tense detected:")
#         error_list.append(simple_present_tense(text))
#         error_list.append(check_subject_verb_agreement(text))
#     if present_perfect_flag:
#         print("Present Perfect Tense detected:")
#         error_list.append(present_perfect_tense(text))
#     if present_continuous_flag:
#         print("Present Continuous Tense detected:")
#         error_list.append(present_continous_tense(text))
#     if future_continuous_flag:
#         print("Future Continuous Tense detected:")
#         error_list.append(future_continuous(text))
#     if simple_future_flag:
#         print("Simple Future Tense detected:")
#         error_list.append(simple_future_tense(text))
#     if future_perfect_flag:
#         print("Future Perfect Tense detected:")
#         error_list.append(future_perfect_tense(text))
    
#     # Common grammar checks
#     error_list.append(check_auxiliary(text))
#     error_list.append(check_subject_verb_agreement(text))
#     error_list.append(check_adjective_order(text))
#     error_list.append(check_voices(text))
#     error_list.append(check_prepositions(text))
#     error_list.append(check_articles(text))
    
#     return error_list


def identify_errors(text):
    doc = nlp(text)
    # Initialize flags to track verb tenses/aspects
    simple_present_flag = False
    present_perfect_flag = False
    present_continuous_flag = False
    future_continuous_flag = False
    simple_future_flag = False
    future_perfect_flag = False
    past_continuous_flag = False
    past_perfect_flag = False
    past_perfect_continuous_flag = False
    simple_past_flag = False
    
    for token in doc:
        # Check for Present Tenses
        if token.tag_ in ['VB', 'VBP', 'VBZ']:
            simple_present_flag = True
        elif token.tag_ == 'VBN' and (token.dep_ == 'aux' and token.text in ['has', 'have']):
            present_perfect_flag = True
        elif token.tag_ == 'VBG' and (token.dep_ == 'aux' and token.text in ['am', 'is', 'are']):
            present_continuous_flag = True
        
        # Check for Future Tenses
        elif token.tag_ == 'VBG' and (token.dep_ == 'aux' and token.text in ['will', 'shall']):
            future_continuous_flag = True
        elif token.text in ['will', 'shall'] and token.tag_ == 'VB':
            simple_future_flag = True
        elif token.tag_ == 'VBN' and token.dep_ == 'aux' and token.text in ['will', 'shall']:
            future_perfect_flag = True

        # Check for Past Tenses
        elif token.text == 'had' and token.dep_ == 'aux':
            if any(child.tag_ == 'VBG' for child in doc):  # Check for "had been"
                past_perfect_continuous_flag = True
            elif any(child.tag_ == 'VBN' for child in doc):  # Check for "had" + VBN
                past_perfect_flag = True
        elif token.tag_ == 'VBG' and token.dep_ == 'aux' and token.text in ['was', 'were']:
            past_continuous_flag = True
        elif token.tag_ == 'VBD' and not past_perfect_flag and not past_perfect_continuous_flag:
            simple_past_flag = True

    error_list = []

    # Prioritize more specific tense checks
    if past_perfect_flag or past_perfect_continuous_flag:
        if past_perfect_flag:
            print("Past Perfect Tense detected:")
            error_list.append(past_perfect_tense(text))
        if past_perfect_continuous_flag:
            print("Past Perfect Continuous Tense detected:")
            error_list.append(past_perfect_continuous(text))
    elif past_continuous_flag:
        print("Past Continuous Tense detected:")
        error_list.append(past_continuous_tense(text))
    elif simple_past_flag:
        print("Simple Past Tense detected:")
        error_list.append(simple_past_tense(text))
    
    # Check other tenses
    if simple_present_flag:
        print("Simple Present Tense detected:")
        error_list.append(simple_present_tense(text))
        error_list.append(check_subject_verb_agreement(text))
    if present_perfect_flag:
        print("Present Perfect Tense detected:")
        error_list.append(present_perfect_tense(text))
    if present_continuous_flag:
        print("Present Continuous Tense detected:")
        error_list.append(present_continous_tense(text))
    if future_continuous_flag:
        print("Future Continuous Tense detected:")
        error_list.append(future_continuous(text))
    if simple_future_flag:
        print("Simple Future Tense detected:")
        error_list.append(simple_future_tense(text))
    if future_perfect_flag:
        print("Future Perfect Tense detected:")
        error_list.append(future_perfect_tense(text))
    
    # Common grammar checks
    error_list.append(check_auxiliary(text))
    error_list.append(check_subject_verb_agreement(text))
    error_list.append(check_adjective_order(text))
    error_list.append(check_voices(text))
    error_list.append(check_prepositions(text))
    error_list.append(check_articles(text))
    
    return error_list

"""Calculate the Score"""
print(suggestions)
# Customize penalty per error type
error_weights = {
    "tense": 15,  # Deduct 15 points for tense errors
    "subject_verb": 10,
    "auxiliary": 5,
    "conjuction":2,
    "article" : 1,
    "preposition": 2,
    "adjective": 1,
}
errors=[]
def calculate_weighted_score(text):
    global suggestions
    errors = identify_errors(text)  # Make sure `identify_errors` returns a list, even if it's empty
    if errors is None:
        errors = []  # Ensure `errors` is a list if it was returned as None
        suggestions = "No suggestion is required"
    else:
        mistakes= ", ".join(suggestions)
        suggestions= []
    print(suggestions)
    
    final_score = 100
    for error in errors:
        if "tense" == error:
          final_score -= error_weights["tense"]
        elif "subject_verb" == error:
          final_score -= error_weights["subject_verb"]
        elif "auxiliary" == errors:
          final_score -= error_weights["auxiliary"]
        elif "conjuction" == errors:
          final_score -= error_weights["conjuction"]
        elif "article" == errors:
          final_score -= error_weights["article"]
        elif "preposition" == errors:
          final_score -= error_weights["preposition"]
        elif "adjective" == errors:
          final_score -= error_weights["adjective"]
        else:
          final_score -= 0  # Default deduction

    # Deduct score based on the identified errors
    for error in errors:
        # Here we check if the error contains a known error type
        for error_type in error_weights:
            if error_type in error.lower():  # Check if the error message contains the error type
                final_score -= error_weights[error_type]

    # Ensure final score does not go below 0
    final_score = max(0, final_score)
    print("Final Score:", final_score)
    return final_score,mistakes

