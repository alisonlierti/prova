import { config } from "./src/app/index.config";
import { runBlock } from "./src/app/index.run";
import { RequestService } from "./src/app/service/service";
import { MainController } from "./src/app/controllers/mainController";


angular.module( "provaSenior", [ ] )
	.config( config )
	.run( runBlock )
	.service( "RequestService", RequestService )
	.controller( "MainController", MainController )
	.name;
