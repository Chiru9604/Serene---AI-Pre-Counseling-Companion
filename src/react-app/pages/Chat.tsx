import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Send, Bot, User, Heart, LogOut, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  copingTip?: {
    title: string | null;
    content: string | null;
  };
  riskLevel?: 'Low' | 'Medium' | 'High';
  timestamp: Date;
}

interface BotResponse {
  trigger_keywords: string;
  response_text: string;
  coping_tip_title: string | null;
  coping_tip_content: string | null;
  risk_level: 'Low' | 'Medium' | 'High';
}

// Greeting responses for casual interactions
const GREETING_RESPONSES: BotResponse[] = [
  {
    trigger_keywords: 'hi, hello, hey, good morning, good afternoon, good evening, greetings, howdy',
    response_text: 'Hello! It\'s great to meet you. I\'m Serene, your emotional wellness companion. How are you feeling today? Feel free to share whatever\'s on your mind - whether it\'s something specific you\'d like to talk through or you\'d just like to check in.',
    coping_tip_title: null,
    coping_tip_content: null,
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'how are you, what\'s up, wassup, sup',
    response_text: 'I\'m here and ready to listen! Thank you for asking. More importantly, how are you doing today? I\'m here to support you with whatever you\'d like to discuss.',
    coping_tip_title: null,
    coping_tip_content: null,
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'good, fine, okay, ok, alright, well, great, awesome, fantastic',
    response_text: 'I\'m glad to hear that! It\'s wonderful when things are going well. Is there anything specific that\'s contributing to you feeling good today, or anything else you\'d like to chat about?',
    coping_tip_title: null,
    coping_tip_content: null,
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'not much, nothing much, just checking in, checking in',
    response_text: 'Thanks for checking in! Sometimes it\'s nice to just touch base. I\'m here whenever you want to talk about anything - big or small. What\'s been on your mind lately?',
    coping_tip_title: null,
    coping_tip_content: null,
    risk_level: 'Low'
  }
];

// Extended bot responses with more varied content
const BOT_RESPONSES: BotResponse[] = [
  {
    trigger_keywords: 'stress, stressed, stressful, pressure, overwhelmed, anxiety, anxious, worry, worried',
    response_text: 'Oh wow, stress can really feel like carrying a backpack full of rocks, can\'t it? I completely get it - and honestly, just admitting you\'re overwhelmed shows real self-awareness. That\'s actually pretty brave of you! 💙 What\'s been weighing on your mind the most lately? Sometimes just talking it out can help us figure out which rocks we can actually put down.',
    coping_tip_title: 'The 4-7-8 Stress Buster',
    coping_tip_content: 'Here\'s my favorite quick stress relief: Breathe in through your nose for 4 counts, hold your breath for 7 counts, then exhale through your mouth for 8 counts. Do this 3-4 times. It\'s like hitting a reset button for your nervous system!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'very sad, extremely sad, devastated, heartbroken, depressed really bad, can\'t stop crying, want to die, suicidal, kill myself, end it all',
    response_text: 'Hey, I can feel how much pain you\'re in right now, and I\'m really glad you reached out to me. That took courage. You know what? Even in your darkest moment, you\'re still here, still fighting - and that makes you incredibly strong, even if you don\'t feel it. Can I share something silly with you? Why don\'t scientists trust atoms? Because they make up everything! 😊 I know, terrible joke, but sometimes we need a tiny smile in the darkness. You matter so much, and this feeling, as intense as it is, won\'t last forever. What\'s one tiny thing that usually brings you even the smallest comfort?',
    coping_tip_title: 'Emergency Self-Care Kit',
    coping_tip_content: 'Right now: Put on your coziest clothes, make a warm drink, and wrap yourself in a blanket. Call someone who cares about you. If you\'re having thoughts of hurting yourself, please reach out to a crisis helpline: 988 (Suicide & Crisis Lifeline) or text HOME to 741741.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'feeling down, little sad, bit sad, meh, blah, unmotivated, tired of everything',
    response_text: 'Ugh, those "meh" days are the worst, aren\'t they? It\'s like your emotional battery is at 15% and everything feels like it requires 100% energy. I totally get that feeling - you\'re not broken, you\'re just human having a human experience. Sometimes our brains need a little vacation from being "on" all the time. What usually helps recharge your batteries, even just a little bit?',
    coping_tip_title: 'The Tiny Wins Strategy',
    coping_tip_content: 'Pick 3 ridiculously small things to accomplish today: make your bed, drink a glass of water, send one nice text. Seriously, that small! Sometimes we need to start with baby steps to remind ourselves we\'re capable.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'exam, exams, test, tests, studying, school, college, university, academic, grades, failing, failed',
    response_text: 'Oh gosh, exam season - the time when coffee becomes a food group and stress levels reach astronomical heights! 📚 I feel you completely. The pressure can be absolutely crushing, but here\'s the thing - you are SO much more than any grade on a piece of paper. I\'ve seen brilliant people struggle with tests and still go on to do amazing things. What subject is giving you the most trouble right now?',
    coping_tip_title: 'Brain-Friendly Study Method',
    coping_tip_content: 'Try the "Pomodoro Plus" technique: Study for 25 minutes, then take a 5-minute "celebration break" - do a little dance, pet a dog, eat something yummy. Your brain learns better when it associates studying with small rewards!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'procrastination, procrastinating, can\'t focus, distracted, lazy, unproductive, wasting time',
    response_text: 'Ah, procrastination - the art of doing everything except the thing you\'re supposed to do! 😅 You know what\'s funny? The fact that you\'re aware you\'re procrastinating shows you actually DO care about getting things done. Sometimes our brains procrastinate because the task feels too big or scary. What if we could trick your brain into thinking it\'s easy?',
    coping_tip_title: 'The "Just 5 Minutes" Trick',
    coping_tip_content: 'Set a timer for just 5 minutes and tell yourself you only have to work for that long. Often, starting is the hardest part, and you\'ll find yourself continuing past the 5 minutes. If not, that\'s okay too - 5 minutes is still progress!',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'breakup, broke up, ex, relationship ended, heartbreak, dumped, left me',
    response_text: 'Oh honey, breakups are like emotional tornadoes - they just tear through your heart and leave everything scattered. I\'m so sorry you\'re going through this. It really, truly sucks, and anyone who says "you\'re better off without them" right now can just... not. You\'re allowed to be sad. You\'re allowed to miss them. And you\'re allowed to eat ice cream for breakfast (just this once). What\'s the hardest part about this for you right now?',
    coping_tip_title: 'Heartbreak Survival Kit',
    coping_tip_content: 'Create a "breakup playlist" with both sad songs (for crying) and empowering songs (for when you\'re ready). Write a letter you\'ll never send. Most importantly: reach out to friends, binge-watch comfort shows, and remember that this pain is temporary.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'insomnia, can\'t sleep, sleepless, tired but can\'t sleep, 3am, wide awake',
    response_text: 'Ugh, the 3am stare-at-the-ceiling club! Welcome, unfortunately. 🌙 There\'s something uniquely frustrating about being exhausted but having your brain decide it\'s time for a philosophical deep-dive or worry session. Your brain is basically that friend who wants to have deep conversations at the worst possible time. What usually goes through your mind when you can\'t sleep?',
    coping_tip_title: 'The Sleep Story Method',
    coping_tip_content: 'Try the "Boring Story" technique: Make up the most mundane story possible in your head (like organizing a spice rack alphabetically). Your brain will get bored and drift off. Or try the 4-7-8 breathing while imagining each breath as a wave washing away your thoughts.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'friend fight, fight with friend, friend argument, argument with friend, friendship problems, friendship issues, friend conflict, conflict with friend, friends fighting, fell out with friend, friend drama, best friend fight, close friend fight',
    response_text: 'Ugh, friend fights are the WORST! 💔 It\'s like when your favorite song suddenly sounds wrong - everything feels off and uncomfortable. Friendships are supposed to be our safe spaces, so when they get rocky, it can feel like the ground is shifting under your feet. These conflicts hurt extra because we care so much about these people. What happened with your friend? Was it something big or did it escalate from something small?',
    coping_tip_title: 'Friendship Conflict Resolution',
    coping_tip_content: 'Take some time to cool off before reaching out. When you\'re ready, try the "I feel" approach: "I felt hurt when..." instead of "You always..." Focus on the specific situation, not their character. Most friendship fights can be resolved with honest communication and mutual understanding.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'lost a friend, friendship ended, former friend, ex friend, friendship over, friend betrayed me, friend hurt me, toxic friend, friend ghosted me, friend abandoned me',
    response_text: 'Losing a friend can honestly feel like a breakup, but somehow worse because society doesn\'t give us scripts for grieving friendships. 😢 It\'s this unique kind of heartbreak that people don\'t always understand. Whether it ended dramatically or just faded away, you\'re allowed to feel sad, angry, confused, or all of the above. The memories you shared were real, even if the friendship couldn\'t continue. What\'s been the hardest part about losing this friendship?',
    coping_tip_title: 'Healing from Friendship Loss',
    coping_tip_content: 'Allow yourself to grieve this relationship - it was real and meaningful. Write about the good memories, then write about what you learned. Focus on the friends who are still in your life. Remember: outgrowing people is part of growing up, and it doesn\'t diminish what you once shared.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'making friends, hard to make friends, no friends, struggling with friendships, social awkward, don\'t know how to make friends, friendship anxiety, social connections',
    response_text: 'Making friends as an adult (or even as a teen) is like trying to learn a language that everyone else seems to speak fluently! 🤝 It\'s honestly one of life\'s most underrated challenges. The pressure to find "your people" is real, and it can feel really isolating when it doesn\'t come naturally. But here\'s the thing - most people are just as eager for genuine connection as you are, they\'re just as nervous about making the first move. What feels like the biggest obstacle in making new friendships for you?',
    coping_tip_title: 'Friendship Building Strategies',
    coping_tip_content: 'Start with shared interests - join clubs, classes, or online communities about things you love. Be the friend you want to have: listen actively, remember details, follow up on conversations. Quality over quantity always - one genuine friend is worth more than ten superficial ones.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'family problems, parents, mom, dad, siblings, family drama, family fight',
    response_text: 'Family - you can\'t live with them, and you can\'t change your DNA! 😊 Family dynamics can be SO complicated because these are the people who know exactly which buttons to push (usually because they installed them). It\'s tough when the people who are supposed to be your safe space sometimes feel like the opposite. What\'s going on with your family situation?',
    coping_tip_title: 'Family Boundary Setting',
    coping_tip_content: 'Remember: You can love your family AND protect your peace. Try the "Gray Rock" method for difficult conversations - be polite but boring, like a gray rock. Don\'t give them emotional ammunition. Also, it\'s okay to limit time with family members who consistently drain your energy.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'work stress, boss, job, hate my job, workplace, toxic work, burnout',
    response_text: 'Oof, work stress is like that unwelcome houseguest who just won\'t leave! 💼 It follows you home, interrupts your weekends, and makes Sunday nights feel like impending doom. Your job should fund your life, not consume it. But I get it - easier said than done when bills need paying. What\'s making work feel especially tough right now?',
    coping_tip_title: 'Work-Life Boundary Ritual',
    coping_tip_content: 'Create a "leaving work at work" ritual: Change your clothes when you get home, take 5 deep breaths at your door, or listen to one favorite song. Physically signal to your brain that work time is over. Your worth is not determined by your productivity!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'lonely, alone, no friends, isolated, nobody cares, nobody likes me',
    response_text: 'Loneliness is honestly one of the most painful human experiences, and I\'m really sorry you\'re feeling this way. It\'s like being hungry, but for human connection. The cruel irony is that when we feel lonely, we often pull away from people, which makes us feel even more alone. But here\'s what I know - you reached out to me, which means you haven\'t given up on connection. That\'s actually pretty brave. What\'s making you feel most isolated right now?',
    coping_tip_title: 'Connection Building Baby Steps',
    coping_tip_content: 'Start super small: smile at one person today, say thank you with eye contact, comment genuinely on someone\'s social media post. Join online communities about your interests. Even small connections can help break the loneliness cycle.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'social anxiety, social situations, awkward, embarrassed, judgment, people judging',
    response_text: 'Social anxiety is like having a very dramatic internal narrator who assumes everyone is watching and judging your every move! 🎭 Plot twist: most people are too busy worrying about their own awkward moments to notice yours. I know that doesn\'t make the feeling less real though. Social stuff can be genuinely exhausting when your brain is running worst-case scenarios in the background. What social situations feel the most overwhelming for you?',
    coping_tip_title: 'Social Confidence Hack',
    coping_tip_content: 'Try the "One Question Rule" - ask one genuine question about the other person. People love talking about themselves, and it takes pressure off you to be interesting. Also, remember: that embarrassing thing you did? They probably forgot about it in 5 minutes.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'money problems, broke, financial stress, debt, can\'t afford, poor, bills',
    response_text: 'Money stress is like background music you can\'t turn off - it affects everything, doesn\'t it? 💸 It\'s hard to focus on self-care or happiness when you\'re worried about basic needs. And society doesn\'t make it easier with all the pressure to "just work harder" as if it\'s that simple. Financial stress is real stress, and it\'s completely understandable that you\'re worried. What\'s feeling most overwhelming about your money situation right now?',
    coping_tip_title: 'Financial Anxiety Relief',
    coping_tip_content: 'Write down three small financial actions you can take this week - even checking your balance counts! Knowledge reduces anxiety, even when the news isn\'t great. Look into local food banks, assistance programs, or financial counseling services. You\'re not alone in this.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'body image, fat, ugly, weight, appearance, mirror, hate my body',
    response_text: 'Body image struggles are so painful because we\'re literally stuck in the body we\'re criticizing - talk about a 24/7 roommate situation! 💔 Our culture has done such a number on us about what bodies "should" look like. But here\'s what I wish I could make everyone understand: your body is not your worth. Your body is the incredible machine that lets you hug people, taste amazing food, and experience life. What\'s been making you feel particularly rough about your body lately?',
    coping_tip_title: 'Body Appreciation Practice',
    coping_tip_content: 'Every morning, thank your body for 3 specific things it does for you - maybe your legs for carrying you, your hands for creating things, your heart for beating. Focus on function over form. Unfollow accounts that make you feel bad about yourself!',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'perfectionist, perfectionism, not good enough, high standards, failure, disappointed',
    response_text: 'Ah, perfectionism - the art of making everything harder than it needs to be! 🎯 It\'s like having a really mean personal trainer in your head who\'s never satisfied. The exhausting thing about perfectionism is that the goalpost keeps moving. You achieve something amazing, and instead of celebrating, your brain goes "cool, now do it better." What area of your life is perfectionism making the most difficult right now?',
    coping_tip_title: 'The "Good Enough" Challenge',
    coping_tip_content: 'This week, intentionally do something at 80% effort. Send an email without triple-checking it. Leave one typo in a text message. Submit something that\'s good enough rather than perfect. Notice that the world doesn\'t end!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'imposter syndrome, fraud, don\'t deserve, lucky, fake it, not qualified',
    response_text: 'Imposter syndrome is like having a tiny critic in your brain with a megaphone, constantly announcing that you don\'t belong! 📢 It\'s particularly cruel because it often shows up right when you\'re achieving something great. Plot twist: the fact that you have imposter syndrome probably means you\'re actually competent - incompetent people rarely worry about being frauds! What situation is making you feel most like an imposter right now?',
    coping_tip_title: 'Imposter Syndrome Reality Check',
    coping_tip_content: 'Keep an "evidence folder" - screenshots of compliments, achievements, positive feedback. When imposter syndrome hits, review the evidence. Also remember: you don\'t have to know everything to deserve your place. Everyone is learning as they go!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'angry, mad, furious, rage, pissed off, irritated, frustrated',
    response_text: 'Anger is like having a fire alarm going off in your chest - it\'s loud, impossible to ignore, and usually telling you something important! 🔥 Sometimes anger gets a bad rap, but it\'s often just other emotions (hurt, disappointment, fear) wearing a tough disguise. It makes sense that you\'re feeling this way. What\'s really getting under your skin right now?',
    coping_tip_title: 'Anger Release Techniques',
    coping_tip_content: 'Try the "Anger Iceberg" - ask yourself what\'s underneath the anger. Hurt? Disappointment? Fear? For immediate relief: go for a walk, punch a pillow, scream into a towel, or do jumping jacks. Sometimes we need to move the anger through our body first.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'jealous, jealousy, envious, comparing, everyone else, why not me',
    response_text: 'Ah, jealousy - that green-eyed monster that makes us feel terrible about ourselves while scrolling through other people\'s highlight reels! 💚 It\'s like comparing your behind-the-scenes to everyone else\'s movie trailer. Jealousy is actually pretty normal (though it feels awful), and it usually tells us something about what we want for ourselves. What\'s been triggering those comparison feelings for you?',
    coping_tip_title: 'Jealousy Transformation',
    coping_tip_content: 'Try "jealousy journaling" - when you feel envious, write down what specifically you\'re jealous of. Then ask: "What does this tell me about what I want?" Use jealousy as a GPS for your own goals. Also, limit social media when you\'re feeling vulnerable!',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'change, transition, scared of change, uncertainty, unknown, what if',
    response_text: 'Change is like being handed a map written in a language you don\'t speak - even good changes can feel terrifying! 🗺️ Our brains are literally wired to prefer the familiar, so it makes complete sense that uncertainty feels uncomfortable. Even when we know change might be good for us, our nervous system is like "but what if everything goes wrong?" What change is feeling most overwhelming for you right now?',
    coping_tip_title: 'Change Navigation Strategy',
    coping_tip_content: 'Focus on what you CAN control during transitions. Make a list: things you can influence vs. things you can\'t. Channel your energy toward your influence list. Also, remember that you\'ve survived 100% of your difficult days so far - pretty good track record!',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'guilt, guilty, shame, regret, should have, bad person, terrible thing',
    response_text: 'Guilt and shame are like having a prosecutor and judge living in your head, constantly reviewing your past decisions! ⚖️ The difference is: guilt says "I did something bad" while shame says "I AM bad." You\'re not a bad person - you\'re a human person who made a human mistake. What\'s been weighing on your conscience lately?',
    coping_tip_title: 'Self-Forgiveness Practice',
    coping_tip_content: 'Write yourself a forgiveness letter as if you were writing to your best friend. What would you tell them? Practice self-compassion: "I made a mistake. I\'m human. I can learn from this." Make amends if possible, then focus on doing better going forward.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'confusion, confused, don\'t know, lost, direction, purpose, meaning',
    response_text: 'Feeling lost is like being in a maze where all the paths look the same - disorienting and kind of scary! 🌫️ But here\'s something interesting: feeling confused often means you\'re growing. Your old answers aren\'t fitting anymore, which makes space for new understanding. It\'s uncomfortable, but it\'s also kind of exciting if you think about it. What area of your life feels most unclear right now?',
    coping_tip_title: 'Clarity Building Exercise',
    coping_tip_content: 'Try the "Values Compass" exercise: List your top 5 values (like honesty, creativity, family). Then ask: "Is my current path aligned with these values?" Sometimes confusion clears when we reconnect with what truly matters to us.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'motivation, unmotivated, no energy, don\'t care, gave up, what\'s the point',
    response_text: 'Zero motivation is like trying to drive a car with an empty gas tank - you know where you want to go, but nothing\'s happening when you press the pedal! 🚗 Sometimes lack of motivation is our brain\'s way of saying "hey, we need rest" or "this path isn\'t working for us." It doesn\'t mean you\'re lazy or broken. What usually motivates you that just isn\'t working right now?',
    coping_tip_title: 'Motivation Kickstarter',
    coping_tip_content: 'Start ridiculously small - like "I will put on shoes" small. Often motivation follows action, not the other way around. Also, check your basics: sleep, food, water, sunlight. Sometimes low motivation is just our body asking for care.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'dating, crush, like someone, rejection, unrequited, love, romantic',
    response_text: 'Ah, matters of the heart - where logic goes to die and emotions run the show! 💕 Whether it\'s butterflies, heartbreak, or that awkward "do they like me back?" uncertainty, romantic feelings can make even the most sensible person feel like a teenager again. Love is beautiful and terrifying and wonderful and awful all at the same time. What\'s your heart dealing with right now?',
    coping_tip_title: 'Dating Confidence Booster',
    coping_tip_content: 'Remember: rejection isn\'t about your worth, it\'s about compatibility. You want someone who\'s excited about you, not someone you have to convince. Focus on being the best version of yourself rather than trying to be what you think they want.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'addiction, drinking, drugs, smoking, habit, can\'t stop, dependent',
    response_text: 'Addiction is like being in a relationship with something that promises to help but ends up hurting you. It\'s complicated, it\'s painful, and it\'s incredibly brave of you to acknowledge it. 🤍 Recovery isn\'t linear, and every single day you choose to work on it matters, even the hard days. You\'re not weak - addiction is a real medical condition, not a character flaw. What feels most challenging about this for you right now?',
    coping_tip_title: 'Recovery Support Steps',
    coping_tip_content: 'Consider reaching out to a support group (AA, NA, SMART Recovery), a counselor who specializes in addiction, or a trusted friend. Have a plan for difficult moments: call someone, go for a walk, use a coping skill. Recovery is possible, and you deserve support.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'trauma, ptsd, flashbacks, triggered, abuse, assault, violence',
    response_text: 'First, I want you to know that you\'re incredibly brave for even thinking about this stuff, let alone talking about it. 🤍 Trauma is like having an invisible wound that others can\'t see but that affects everything. Your reactions, your feelings, your healing process - all of it is valid. You survived something difficult, and that makes you a survivor, not a victim. How are you feeling right now in this moment?',
    coping_tip_title: 'Trauma Grounding Technique',
    coping_tip_content: 'If you\'re feeling triggered: 5-4-3-2-1 grounding - name 5 things you see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste. This brings you back to the present. Please consider trauma-informed therapy - you deserve professional support.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'bored, boring, nothing to do, empty, numb, flat, emotionless',
    response_text: 'Boredom mixed with emptiness is like being hungry but nothing sounds good to eat - super frustrating! 😐 Sometimes this feeling is our brain\'s way of saying "we need something new" or "we\'re avoiding something." Sometimes it\'s depression wearing a boredom mask. And sometimes we\'re just genuinely understimulated. When did you last feel genuinely excited about something?',
    coping_tip_title: 'Spark-Finding Mission',
    coping_tip_content: 'Try the "curiosity challenge" - spend 10 minutes learning about something completely random online. Or do something slightly different: take a new route, try a new coffee flavor, text someone you haven\'t talked to in a while. Sometimes tiny novelty can restart our interest.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'feeling left out, excluded, not invited, everyone else, FOMO, fear of missing out, left behind, third wheel, outcast, don\'t belong',
    response_text: 'That feeling of being on the outside looking in is just brutal - like watching life happen through a window while you\'re stuck outside in the cold. 🥺 FOMO and feeling excluded can make us question everything about ourselves, but here\'s what I know: your worth isn\'t determined by invitations or social media posts. Sometimes people are thoughtless, not malicious. Sometimes groups just form naturally without anyone meaning to exclude. What situation is making you feel most left out right now?',
    coping_tip_title: 'Dealing with Exclusion',
    coping_tip_content: 'Remember that social media shows highlights, not reality. Make your own plans - invite someone to coffee, organize a small gathering, or treat yourself to something special. Focus on the people who do include you, even if the circle is smaller. Quality connections matter more than quantity.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'peer pressure, pressure from friends, fitting in, trying to fit in, don\'t want to, feel pressured, friends want me to, everyone is doing it',
    response_text: 'Peer pressure is like having a bunch of voices in your head, but they\'re coming from outside and they\'re all saying "come on, just this once!" 😅 It\'s so tough because you want to fit in and be liked, but something inside you is saying "this doesn\'t feel right." That inner voice? That\'s your wisdom talking, and it\'s worth listening to. What kind of pressure are you feeling from your friends?',
    coping_tip_title: 'Standing Strong Against Pressure',
    coping_tip_content: 'Practice saying "no" in low-stakes situations to build your confidence. Have a few ready responses: "I\'m good, thanks," "Not my thing," or "I\'m driving tonight." Real friends will respect your boundaries. If they don\'t, they might not be the right friends for you.',
    risk_level: 'Medium'
  },
  {
    trigger_keywords: 'bullying, bullied, mean people, being picked on, harassed, teased, made fun of, cruel, hurt by others, victimized',
    response_text: 'I\'m so sorry you\'re dealing with people being cruel to you. Bullying is never okay, and it\'s not your fault - full stop. 💙 It says everything about them and nothing about you. Mean people often hurt others because they\'re hurting inside, but that doesn\'t excuse their behavior or make it hurt any less for you. You deserve to feel safe and respected. What\'s been happening, and do you have adults you can talk to about this?',
    coping_tip_title: 'Dealing with Bullying',
    coping_tip_content: 'Document incidents with dates and details. Tell trusted adults - teachers, parents, counselors. Don\'t engage with bullies if possible - they feed off reactions. Surround yourself with supportive people. Remember: this is temporary, and you are stronger than their words.',
    risk_level: 'High'
  },
  {
    trigger_keywords: 'hope, hopeful, better, improving, good day, feeling positive, grateful',
    response_text: 'Oh this is so lovely to hear! 🌟 It sounds like you\'re in a brighter space right now, and that\'s wonderful. These good moments are so important - they remind us that feelings really do change, even when we\'re in the thick of difficult times. What\'s been helping you feel more positive lately? I\'d love to celebrate this with you!',
    coping_tip_title: 'Good Moment Preservation',
    coping_tip_content: 'Write down what\'s working for you right now - the thoughts, activities, or people that are helping. Create a "good day toolkit" you can reference during harder times. Take a moment to really soak in this positive feeling.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'thank you, thanks, grateful, appreciate, helped, better',
    response_text: 'Aww, you\'re so welcome! 🤗 It honestly makes my whole day when someone feels even a little bit better after our chat. That\'s exactly why I\'m here. Remember, you did the hard work of reaching out and being open - I just got to be part of your journey for a moment. How are you feeling now compared to when we started talking?',
    coping_tip_title: 'Gratitude Momentum',
    coping_tip_content: 'Since you\'re feeling thankful, try writing down 3 things you\'re grateful for today - they can be tiny! Gratitude literally rewires our brain to notice more positive things. You\'re building a superpower!',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'goodbye, bye, talk to you later, see you later, gotta go, have to go, nice speaking to you, nice talking to you, nice chatting, take care, until next time, catch you later',
    response_text: 'It was really wonderful talking with you too! 🌟 Thank you for trusting me with your thoughts and feelings - that means so much. I hope our conversation gave you something helpful to take with you. Remember, I\'m always here whenever you need someone to listen. Take care of yourself, and remember - you\'re stronger than you know! 💙',
    coping_tip_title: 'Carrying Support With You',
    coping_tip_content: 'Remember the strategies we discussed today and don\'t hesitate to use them. Keep a mental note of what felt helpful in our conversation. And remember - reaching out when you need support is a sign of strength, not weakness.',
    risk_level: 'Low'
  },
  {
    trigger_keywords: 'feeling better now, much better, that helped, I feel good now, you helped me, this was helpful, I\'m better now',
    response_text: 'Oh this just fills my heart! 🥰 I\'m so incredibly happy to hear you\'re feeling better. You did such a brave thing by reaching out and being open about what you were going through. That takes real courage. Hold onto this feeling - you\'ve shown yourself that difficult moments can shift and that you have the strength to work through tough times. I\'m genuinely so proud of you!',
    coping_tip_title: 'Celebrating Progress',
    coping_tip_content: 'Take a moment to acknowledge what just happened - you felt bad, reached out for help, engaged with support, and now you feel better. That\'s the recovery process in action! Remember this sequence for future tough moments.',
    risk_level: 'Low'
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
];

export default function Chat() {
  const { user, logout, isPending } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save data to localStorage for counselor dashboard
  const saveToLocalStorage = (message: Message, userMessage: string, riskLevel: 'Low' | 'Medium' | 'High') => {
    if (!user) return;

    // Save user profile
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    userProfiles[user.id] = {
      name: user.google_user_data.name,
      email: user.google_user_data.email,
      picture: user.google_user_data.picture
    };
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

    // Save message
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const newMessage = {
      id: chatMessages.length + 1,
      user_id: user.id,
      user_message: userMessage,
      ai_response: message.content,
      risk_level: riskLevel,
      coping_tip_title: message.copingTip?.title || null,
      coping_tip_content: message.copingTip?.content || null,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    chatMessages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));

    // Update user session
    const userSessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
    const recentMessages = chatMessages
      .filter((msg: any) => msg.user_id === user.id && msg.session_id === sessionId)
      .slice(-3)
      .map((msg: any) => msg.user_message);
    
    const existingSessionIndex = userSessions.findIndex((session: any) => session.session_id === sessionId);
    const sessionData = {
      id: existingSessionIndex >= 0 ? userSessions[existingSessionIndex].id : userSessions.length + 1,
      user_id: user.id,
      session_id: sessionId,
      latest_concern: userMessage,
      last_three_messages_summary: recentMessages.join('; '),
      overall_risk_level: riskLevel,
      suggested_next_step: `Offer support session on ${userMessage.toLowerCase().includes('exam') ? 'exam anxiety' : 'emotional wellness'}`,
      is_active: true,
      created_at: existingSessionIndex >= 0 ? userSessions[existingSessionIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingSessionIndex >= 0) {
      userSessions[existingSessionIndex] = sessionData;
    } else {
      userSessions.push(sessionData);
    }
    localStorage.setItem('userSessions', JSON.stringify(userSessions));
  };

  const findBotResponse = (userMessage: string): BotResponse => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for negative expressions first (these take priority)
    const negativePatterns = [
      /\bnot\s+(feeling\s+)?good/,
      /\bnot\s+(feeling\s+)?well/,
      /\bnot\s+(feeling\s+)?fine/,
      /\bnot\s+(feeling\s+)?okay/,
      /\bnot\s+doing\s+well/,
      /\bnot\s+doing\s+good/,
      /feeling\s+(bad|terrible|awful|horrible)/,
      /\bbad\s+day/,
      /having\s+a\s+(hard|tough|difficult)\s+time/
    ];

    const hasNegativeExpression = negativePatterns.some(pattern => pattern.test(lowerMessage));
    
    if (hasNegativeExpression) {
      return {
        trigger_keywords: 'not feeling good, feeling bad',
        response_text: 'I\'m sorry to hear you\'re not feeling good right now. That can be really difficult to experience. Would you like to share more about what\'s going on? Sometimes talking through our feelings can help us process them better. I\'m here to listen and support you.',
        coping_tip_title: 'When You\'re Not Feeling Good',
        coping_tip_content: 'Remember that difficult feelings are temporary and valid. Try to be gentle with yourself today. Consider doing something small that usually brings you comfort, like listening to music, taking a warm shower, or reaching out to someone you trust.',
        risk_level: 'Medium'
      };
    }

    // Check for emotional support topics first (before greetings to avoid generic responses for serious issues)
    const matchedResponse = BOT_RESPONSES.find(response => {
      const keywords = response.trigger_keywords.toLowerCase().split(',');
      return keywords.some(keyword => {
        const trimmedKeyword = keyword.trim();
        // Enhanced keyword matching with word boundaries and variations
        const keywordPatterns = [
          new RegExp(`\\b${trimmedKeyword}\\b`),
          new RegExp(`\\b${trimmedKeyword}s\\b`), // plural
          new RegExp(`\\b${trimmedKeyword}ing\\b`), // gerund
          new RegExp(`\\b${trimmedKeyword}ed\\b`), // past tense
          new RegExp(`\\b${trimmedKeyword}er\\b`), // comparative
        ];
        
        // Special cases for better matching
        if (trimmedKeyword === 'friends') {
          keywordPatterns.push(/\bfriendship\b/);
        }
        if (trimmedKeyword === 'judgment') {
          keywordPatterns.push(/\bjudged?\b/, /\bjudging\b/, /\bjudgmental\b/);
        }
        if (trimmedKeyword === 'relationship') {
          keywordPatterns.push(/\brelate\b/, /\brelating\b/);
        }
        
        return keywordPatterns.some(pattern => pattern.test(lowerMessage));
      });
    });

    if (matchedResponse) {
      return matchedResponse;
    }

    // Only check for simple greetings if no emotional content detected
    const simpleGreetings = ['hi', 'hello', 'hey'];
    const isSimpleGreeting = simpleGreetings.some(greeting => 
      lowerMessage.trim() === greeting || 
      lowerMessage.trim() === `${greeting}!` ||
      lowerMessage.trim() === `${greeting}.`
    );

    if (isSimpleGreeting) {
      const greetingResponse = GREETING_RESPONSES.find(response => 
        response.trigger_keywords.includes('hi, hello, hey')
      );
      if (greetingResponse) {
        return greetingResponse;
      }
    }

    // Check for other casual responses
    const casualResponse = GREETING_RESPONSES.find(response => {
      if (response.trigger_keywords.includes('hi, hello, hey')) return false; // Skip basic greetings
      const keywords = response.trigger_keywords.toLowerCase().split(',');
      return keywords.some(keyword => 
        lowerMessage.includes(keyword.trim())
      );
    });

    if (casualResponse) {
      return casualResponse;
    }

    // Default response for unclear messages - more general and encouraging
    return {
      trigger_keywords: 'general',
      response_text: 'I\'m really glad you reached out to me! 🤗 Sometimes it\'s hard to know exactly where to start, and that\'s totally okay. I\'m here to listen to whatever\'s on your mind - whether it\'s something big that\'s bothering you, just a random thought, or even if you\'re not sure what you want to talk about yet. What feels right to share with me today?',
      coping_tip_title: 'Starting a Conversation',
      coping_tip_content: 'No need to have everything figured out before you start talking! Sometimes the best conversations begin with "I don\'t know how to explain this, but..." or "I\'m feeling weird about something..." Trust that the right words will come.',
      risk_level: 'Low'
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Find matching bot response
      const botResponse = findBotResponse(userMessage.content);

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: botResponse.response_text,
        copingTip: {
          title: botResponse.coping_tip_title,
          content: botResponse.coping_tip_content
        },
        riskLevel: botResponse.risk_level,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to localStorage for counselor dashboard
      saveToLocalStorage(aiMessage, userMessage.content, botResponse.risk_level);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Serene
              </h1>
              <p className="text-sm text-gray-500">Your emotional wellness companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={user.google_user_data.picture || ''} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.google_user_data.given_name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Hello, {user.google_user_data.given_name}!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm here to listen and support you. Share what's on your mind, and I'll do my best to help.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-lg ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-blue-400 to-green-400'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="space-y-3">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  {message.copingTip && message.copingTip.title && message.copingTip.content && (
                    <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-green-500" />
                        <h4 className="text-sm font-semibold text-green-800">
                          {message.copingTip.title}
                        </h4>
                      </div>
                      <p className="text-sm text-green-700 leading-relaxed">
                        {message.copingTip.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/20 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
