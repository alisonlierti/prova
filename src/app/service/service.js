export class RequestService {
	constructor( $http, $rootScope ) {
		"ngInject";
		this.$http = $http;
		this.$rootScope = $rootScope;
	}

	get( param ) {
		return this.$http
			.get( `http://api.apixu.com/v1/forecast.json?key=c6b74997aafa473dac720054160812&q=${param.cidade}&days=7` )
			.then( response => response.data );
	}


}
