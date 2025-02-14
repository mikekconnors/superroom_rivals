async function getSecret() {
    const secret_name = "openAi";
    AWS.config.update({
        region: "us-east-1",
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "YOUR_IDENTITY_POOL_ID" // Replace with your Cognito Identity Pool ID
        })
    });

    const client = new AWS.SecretsManager();

    let response;

    try {
        response = await client.getSecretValue({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT" // VersionStage defaults to AWSCURRENT if unspecified
        }).promise();
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    return response.SecretString;
}

function playAudio() {
    const audio = new Audio('https://sr-static-site.s3.us-east-2.amazonaws.com/dice.m4a');
    audio.play();
}

async function generateSentence() {
    const apiKey = await getSecret();
    const prompt = 'Generate a nonsensical random sentence involving Mario and random gross objects with some disgusting action with some person who is known to be disgusting at some disgusting location:';
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {"role": "user", "content": prompt}
                ]
            })
        });
        
        const data = await response.json();
        const sentence = data.choices[0].message.content.trim();
        document.getElementById('sentence-container').innerText = sentence;
    } catch (error) {
        console.error('Error fetching sentence from OpenAI:', error);
        document.getElementById('sentence-container').innerText = 'Error generating sentence.';
    }
}