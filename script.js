document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const swapBtn = document.getElementById('swapBtn');
    const loading = document.getElementById('loading');
    
    translateBtn.addEventListener('click', translateText);
    swapBtn.addEventListener('click', swapLanguages);
    
    async function translateText() {
        const text = inputText.value.trim();
        if (!text) {
            alert('Please enter some text to translate');
            return;
        }
        
        const source = sourceLang.value;
        const target = targetLang.value;
        
        if (source === target) {
            alert('Source and target languages cannot be the same');
            return;
        }
        
        loading.style.display = 'block';
        outputText.value = '';
        
        try {
            let apiUrl = `https://global-translator-api.bjcoderx.workers.dev/?text=${encodeURIComponent(text)}&targetLang=${target}`;
            
            if (source !== 'auto') {
                apiUrl += `&sourceLang=${source}`;
            }
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Updated response handling
            if (data.status && data.translatedText) {
                outputText.value = data.translatedText;
            } else if (data.translatedText) {
                // Handle case where status might be missing but translation exists
                outputText.value = data.translatedText;
            } else {
                throw new Error(data.message || 'No translation found in response');
            }
        } catch (error) {
            console.error('Translation error:', error);
            outputText.value = `Error: ${error.message}`;
        } finally {
            loading.style.display = 'none';
        }
    }
    
    function swapLanguages() {
        const currentSource = sourceLang.value;
        const currentTarget = targetLang.value;
        
        // Don't swap if source is "auto"
        if (currentSource !== 'auto') {
            sourceLang.value = currentTarget;
        }
        
        // Find the option in target that matches current source (if not auto)
        if (currentSource !== 'auto') {
            targetLang.value = currentSource;
        }
        
        // Also swap the text if there's any
        if (inputText.value && outputText.value) {
            const temp = inputText.value;
            inputText.value = outputText.value;
            outputText.value = temp;
        }
    }
});