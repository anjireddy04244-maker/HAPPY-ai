export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are Happy AI, a friendly and helpful voice assistant. Give clear and concise answers."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return res.status(response.status).json({
                error:
                    data.error?.message ||
                    "AI request failed"
            });
        }

        const answer =
            data.choices?.[0]?.message?.content;

        return res.status(200).json({
            answer: answer || "I couldn't generate an answer."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
}        
