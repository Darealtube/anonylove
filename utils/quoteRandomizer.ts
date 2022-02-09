export const anonyQuotes = [
  `Ever notice that sometimes when you care less about something, you do better at it?
    Notice how it's often the person who is the least invested in the success of something
    that actually ends up achieving it? Notice how sometimes when you stop giving a 
    fuck, everything seems to fall into place?`,
  `To deny one's negative emotions is to deny many of the feedback mechanisms that
    help a person solve problems.`,
  `It's not about giving a fuck about everything your partner gives a fuck about; it's about giving a fuck about 
   your partner regardless of the fucks he or she gives. That's unconditional love, baby.
    `,
  `The ticket to emotional health, like that to physical health, comes from eating your 
    veggies, that is, accepting the bland and mundane truths of life.`,
];

const quoteRandomizer = (quotes: string[]) => {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  return quotes[quoteIndex];
};

export default quoteRandomizer;
