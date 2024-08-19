import { NextResponse } from "next/server";
import OpenAI from "openai";


const systemPrompt = 
`You are a flash card creator. Your task is to generate flashcards based on the provided content. Each flashcard should have a question on one side and the corresponding answer on the other side. Ensure that the questions are clear and concise, and the answers are accurate and informative. The flashcards should be designed to help users learn and retain information effectively.

When creating flashcards, follow these guidelines:
1. Identify key concepts, terms, and facts from the content.
2. Formulate questions that test the user's understanding of these key points.
3. Provide precise and accurate answers to each question.
4. Ensure that the language used is simple and easy to understand.
5. Organize the flashcards in a logical order, starting with basic concepts and progressing to more advanced topics.
6. Make the definitions one short sentence so that they fit in the flashcard 
7. Only generates 10 flashcards.


Return in the following JSON format:
{
  "flashcards":[
        {
            "front": "Front of the card",
            "back": "Back of the card",
        }
  ]
}
`;
export async function POST(req){
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY,});
    
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
            {role:"system", content:systemPrompt},
            {role:"user",content:data},
        ],
        model:"gpt-4o",
        response_format:{type:'json_object'},
    })
 const flashcards = JSON.parse(completion.choices[0].message.content);

 return NextResponse.json(flashcards.flashcards);
}
