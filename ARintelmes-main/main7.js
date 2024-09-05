AFRAME.registerComponent('maintenance-cursor', {
    init: function() {
        // const el = this.el; // Armazena a referência ao elemento
        const factText = document.getElementById('fact-text');
        let fact = '';
  
        fetch('http://numbersapi.com/random/trivia')
        .then(response => response.text())
        .then(data => {
            fact = data;
        })
        .catch(error => console.error('Erro ao conectar à API:', error));
    
        this.el.addEventListener('click', function() {
            factText.setAttribute('value', fact);
        });
    }
});
  
AFRAME.registerComponent('status-cursor', {
    init: function() {
        // const el = this.el; // Armazena a referência ao elemento
        const factText = document.getElementById('fact-text');
        let fact = '';

        fetch('http://numbersapi.com/random/trivia')
        .then(response => response.text())
        .then(data => {
            fact = data;
        })
        .catch(error => console.error('Erro ao conectar à API:', error));
    
        this.el.addEventListener('click', function() {
            factText.setAttribute('value', fact);
        });
    }
});
