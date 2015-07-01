# Ponto

## Como usar: 
Adicione o conteúdo do arquivo Bookmark.js no endereço do seu Bookmark.js, abra a página do ponto e clique no bookmark.

Você pode também apenas adicionar o conteúdo do arquivo Bookmark.js na url do browser, basta abrir a página do ponto e
adicionar o script na url. 

## Bookmark scripts

O script abaixo pega o arquivo do cdn, isso serve principalmente para produção, pois demora um tempo até se propagar.

```javascript
javascript: (function() {
	var scriptToEmbed = document.createElement('script');
	scriptToEmbed.type = 'text/javascript';
	scriptToEmbed.src = 'http://cdn.rawgit.com/JulioGold/ponto/master/ponto.js?x=' + (Math.random());
	document.documentElement.appendChild(scriptToEmbed);
})();
```

O script abaixo pega o arquivo raw para desenvolvimento, não é um cdn então a atualização é imediata.
```javascript
javascript: (function() {
	var scriptToEmbed = document.createElement('script');
	scriptToEmbed.type = 'text/javascript';
	scriptToEmbed.src = 'http://rawgit.com/JulioGold/ponto/master/ponto.js?x=' + (Math.random());
	document.documentElement.appendChild(scriptToEmbed);
})();
```

Referências:
* [http://rawgit.com/](http://rawgit.com/)
* [http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github](http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github)
