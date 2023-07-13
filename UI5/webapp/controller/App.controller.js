sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/MessageBox",
	"sap/m/library",
	"sap/ui/core/mvc/XMLView"
], function (Device, Controller, JSONModel, Popover, Button,MessageBox, library,XMLView) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.App",{
       
        onInit: function () {
			debugger
            var token =  localStorage.getItem("token");
            var usuario =  JSON.parse(localStorage.getItem("dadosUser"));
			if(!this.oRouter){
				this.oRouter = this.getOwnerComponent().getRouter();
			}

            if(!token){
                console.log("Usuario não logado");
                
                this.oRouter.navTo("login");     
            }
			
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/walkthrough/model/data.json"));
			var oUsuarioModel = new JSONModel(usuario);
			this.getView().setModel(oModel);
			this.getView().setModel(oUsuarioModel,'usuario');
			this._setToggleButtonTooltip(!Device.system.desktop);
		},

		onItemSelect: function (oEvent) {
			debugger
			var oItem = oEvent.getParameter("item");
			oItem.getKey()
           
			var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo(oItem.getKey());
		
		},

		handleUserNamePress: function (event) {
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent,
						press: this.handlerLogOut
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(event.getSource());
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},
		handlerLogOut:function(){
			
			//var oRouter = this.getOwnerComponent().getRouter();
			MessageBox.warning("Deseja mesmo sair do sistema? ", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                    onClose: (sAction) =>{
                        if(sAction == "OK"){
							localStorage.removeItem("token");
							localStorage.removeItem("dadosUser");
							window.location.href = '#/login';
							//oRouter.navTo("login");  
                        }
                        
                    }
                });

		}

    });
});