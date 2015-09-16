function callback() {
	(function ($) {
		var jQuery = $;
		// --------------------------------------------------------------------------------
		function calculaPontosDia(periodoTrabalhado) {
			var horaAgora = new Date();
			var agora = horaAgora.getHours() + ":" + horaAgora.getMinutes();

			var horasTrab;

			periodoTrabalhado.map(function (pontos) {
				horasTrab = pontos.reduce(function (a, b) {
					if (!a) return b;
					return b - a;
				});
			});

			var horasTrabH = (horasTrab / (60 * 60 * 1000));
			var horasExtrasFolgaH = ((horasTrab - (8.75 * 60 * 60 * 1000)) / (60 * 60 * 1000));

			var isFolga = true;
			if (horasExtrasFolgaH >= 0) {
				isFolga = false;
			};

			return {
				horasTrabalhadas: horasTrabH.toFixed(2),
				horasExtrasFolga: horasExtrasFolgaH.toFixed(2),
				isFolga: isFolga
			}
		}

		function pontoTextToDateTime(periodoTrabalhado) {

			var pontos = periodoTrabalhado.map(function (ponto) {
				return ponto.split(' ');
			})

			return pontos.map(function (ponto) {
				return ponto.map(function (b) {
					if (!b) return null;
					var d = new Date();
					var sp = /(\d\d):(\d\d)/.exec(b);
					d.setUTCHours(sp[1]);
					d.setUTCMinutes(sp[2]);
					d.setUTCSeconds(0);
					d.setUTCMilliseconds(0);
					return d;
				});
			});
		}

		window.calcDay = function (pontos) {
			return calculaPontosDia(pontoTextToDateTime(pontos));
		}


		function getPontosData() {
			return $('#diasDoEspelho tr').map(function (a, b) {
				var periodoTrabalhado = $($(b).children()[3]).text();
				var reg = /(\d\d:\d\d) (\d\d:\d\d)/gi;
				var result = periodoTrabalhado.match(reg);
				return {
					dia: $($(b).children()[0]).text(),
					periodoTrabalhado: result
				};
			}).toArray().filter(function (a) {
				if (!a.periodoTrabalhado) {
					return false
				};
				return a.periodoTrabalhado.reduce(function (prev, a) {
					return prev || !!a;
				}, false);
			}).map(function (a) {
				a.periodoTrabalhado = pontoTextToDateTime(a.periodoTrabalhado);
				var result = calculaPontosDia(a.periodoTrabalhado);
				a.horasTrabalhadas = result.horasTrabalhadas;
				a.horasExtrasFolga = result.horasExtrasFolga;
				a.isFolga = result.isFolga;
				return a;
			});
		}

		var pontosData = getPontosData();

		var espelho = pontosData.map(function (a) {
			return '</br>+ <strong>Dia</strong>: ' + a.dia + ' <strong>Pontos</strong>: ' + JSON.stringify(a.pontos.map(function (b) {
				if (!b) return null;
				return b.getUTCHours() + ':' + b.getUTCMinutes();
			})) + '</br>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Horas Trabalhadas</strong>: ' + a.horasTrabalhadas + '</br>&nbsp;&nbsp;&nbsp;&nbsp;'
				+ '<strong>Horas Extras/Folga</strong>' + ': ' + '<span style="color:' + (a.isFolga ? "red" : "green") + ';">' + a.horasExtrasFolga + '</span>';
		}).join('</br>');

		// Pega o tamanho do texto do último campo "Marcações", se menor que 11 então ainda não acabou o dia, tenho que descontar essas horas
		if ($('#diasDoEspelho tr:last-child.linhaAlternada td:eq(3)').text().length <= 11) {
			// Pega o texto do campo "Saldo Atual"
			var saldoAtualHoras = $('#segundaColunaTotais tr:last-child td.valorEventoTotal').text();
			var descricaoAtualHoras = $('#segundaColunaTotais tr:last-child td.descricaoEventoTotal').text();
			var ultimoDiaHoras = $('#diasDoEspelho tr:last-child:eq(1) td:eq(4)').text();
			var ultimoDiaHorasData = $('#diasDoEspelho tr:last-child:eq(1) td:eq(0)').text();
			var dataHoje = new Date();
			var sp = /(-?\d\d):(\d\d)/.exec(saldoAtualHoras);
			var spe = /(-?\d\d):(\d\d)/.exec(ultimoDiaHoras);

			var saldoAtualEmHoras = parseInt(sp[1], 10);
			if (saldoAtualEmHoras >= 0) {
				saldoAtualEmHoras += (parseInt(sp[2], 10) / 60);
			} else {
				saldoAtualEmHoras -= (parseInt(sp[2], 10) / 60);
			}

			var saldoAnteriorEmHoras = parseInt(spe[1], 10);
			if (saldoAnteriorEmHoras >= 0) {
				saldoAnteriorEmHoras += (parseInt(spe[2], 10) / 60);
			} else {
				saldoAnteriorEmHoras -= (parseInt(spe[2], 10) / 60);
			}

			var total = saldoAtualEmHoras;

			var hoje = ((dataHoje.getDate() < 10) ? '0' + dataHoje.getDate() : dataHoje.getDate()) + '/' +
				((dataHoje.getMonth() + 1 < 10) ? '0' + (dataHoje.getMonth() + 1) : (dataHoje.getMonth() + 1));

			if (ultimoDiaHorasData == hoje) {
				total = saldoAnteriorEmHoras + saldoAtualEmHoras
			}

			// Caso apareça o fechamento de horas negativas
			if (descricaoAtualHoras == "Fechamento BH (-)") {
				total = saldoAnteriorEmHoras - saldoAtualEmHoras;
			}

			var min = Math.abs(60 * (total - parseInt(total))).toFixed(0)

			espelho = '</br><b>Saldo de horas</b>: ' + '<span style="color:' + (total < 0 ? "red" : "green") + ';">' + total.toFixed(2) + ' (' + parseInt(total) + 'h' + (min < 10 ? '0' + min : min) + ')' + '</span>' + '</br>' + '<hr/>' + espelho;
		}
		// ----



		$('body').html(espelho);
		// --------------------------------------------------------------------------------
	})(jQuery.noConflict(true))
}


var removeScripts = function (doc) {
	var scripts = doc.getElementsByTagName('script');
	for (var i = scripts.length - 1; i >= 0; i -= 1) {
		if (typeof (scripts[i].src) === "undefined" || scripts[i].src.indexOf('ponto') === -1) {
			scripts[i].nodeValue = "";
			scripts[i].removeAttribute('src');
			if (scripts[i].parentNode) {
				scripts[i].parentNode.removeChild(scripts[i]);
			}
		}
	}
};

removeScripts(document);

for (var k = 0; k < document.styleSheets.length; k += 1) {
	if (!!document.styleSheets[k].href && document.styleSheets[k].href.lastIndexOf("ponto") === -1) {
		document.styleSheets[k].disabled = true;
	}
}
var styleTags = document.getElementsByTagName("style");
for (var st = 0; st < styleTags.length; st += 1) {
	styleTags[st].textContent = "";
}


var s = document.createElement('script');
s.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
if (s.addEventListener) {
	s.addEventListener('load', callback, false)
} else if (s.readyState) {
	s.onreadystatechange = callback
}
document.body.appendChild(s);
