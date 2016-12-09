import { cities } from "./../service/cidades.js";
import { estados } from "./../service/estados.js";
export class MainController {
	constructor( $scope, RequestService ) {
		"ngIngect";
		$scope.cidades = [];
		$scope.estados = estados;
		$scope.days = [];
		$scope.diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
		$scope.currentMax = {TEMP: 0};
		$scope.currentMin = {TEMP: 999};

		$scope.estadoSelecionado = false;
		$scope.litoral = false;
		$scope.solved = false;

		$scope.ativaCidade = () => {
			let cidades = cities;
			cidades = cidades.find( est => est.sigla === $scope.estado );
			$scope.cidades = cidades.cidades;
			$scope.estadoSelecionado = true;
		};

		$scope.getDay = day => {
			return $scope.diasSemana[$scope.getIndexDay(day)];
		};

		$scope.getIndexDay = day => {
			return new Date(day.date).getDay();
		};

		$scope.ativaMeteorologia = () => {
			const params = {
				cidade: removerAcentos( $scope.cidade ),
				estado: $scope.estado
			};
			RequestService.get( params )
				.then( data => {
					$scope.days = data.forecast.forecastday;
					$scope.currentTemperature = data.current;
					google.charts.load( "current", { "packages": [ "corechart" ] } );
					google.charts.setOnLoadCallback( () => drawChart( $scope.days ) );
					$scope.solved = true;
					$scope.days.forEach(day => {
						if (day.day.maxtemp_c >= $scope.currentMax.TEMP){
							$scope.currentMax = {
								TEMP: day.day.maxtemp_c,
								DAY: $scope.getDay(day)
							};
						}
						if (day.day.mintemp_c <= $scope.currentMin.TEMP){
							$scope.currentMin = {
								TEMP: day.day.mintemp_c,
								DAY: $scope.getDay(day)
							};
						}
						if ([0, 6].indexOf($scope.getIndexDay(day)) >= 0 && (day.day.condition.code === 1000 || day.day.condition.code === 1003)){
							$scope.litoral = true;
						}
					});
				} );
		};

		$scope.salvarFiltros = () => {
			localStorage.estado = $scope.estado;
			localStorage.cidade = $scope.cidade;
		};

		if ( localStorage.estado ) {
			$scope.estado = localStorage.estado;
			$scope.ativaCidade( localStorage.estado );
			$scope.cidade = localStorage.cidade;
			$scope.ativaMeteorologia();
		}


	}

}

function drawChart( days ) {
	let matriz = [];
	days.forEach( ( day, index ) => {
		matriz[ index ] = [];
		let date = day.date.split( "-" );
		matriz[ index ].push( date[ date.length - 1 ] );
		matriz[ index ].push( day.day.avgtemp_c );
	} );
	matriz.unshift( [ "Dia", "Temperatura" ] );
	const data = google.visualization.arrayToDataTable( matriz );

	const options = {
		title: "Gráfico Meteorológico",
		curveType: "function",
		legend: { position: "bottom" },
		hAxis: {
			title: "Dia",
			logScale: true
		},
		vAxis: {
			title: "Temperatura",
			logScale: false
		}
	};

	const chart = new google.visualization.LineChart( document.getElementById( "curve_chart" ) );

	chart.draw( data, options );
}

function removerAcentos( cidade ) {
	const mapaAcentosHex = {
		a: /[\xE0-\xE6]/g,
		"_": /\s/g,
		e: /[\xE8-\xEB]/g,
		i: /[\xEC-\xEF]/g,
		o: /[\xF2-\xF6]/g,
		u: /[\xF9-\xFC]/g,
		c: /\xE7/g,
		n: /\xF1/g
	};

	for ( let letra in mapaAcentosHex ) {
		const expressaoRegular = mapaAcentosHex[ letra ];
		cidade = cidade.replace( expressaoRegular, letra );
	}

	return cidade;
}
