sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library",
	"sap/ui/core/mvc/XMLView"
], function (Device, Controller, JSONModel, Popover, Button, library,XMLView) {
	"use strict";

	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;

	return Controller.extend("sap.ui.demo.walkthrough.Overview", {

		onInit: function () {
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("login");     
            }
			
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/walkthrough/model/data.json"));
			this.getView().setModel(oModel);
			this._setToggleButtonTooltip(!Device.system.desktop);
		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oScrollContainer = this.byId("idScrollContainer");
			oScrollContainer.removeAllContent();
			var oView = XMLView.create({
				viewName: "sap.ui.demo.walkthrough.view."+oItem.getKey()
			});
			oView.then(function(oViewInstance) {
				oScrollContainer.addContent(oViewInstance);
			});
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		handleUserNamePress: function (event) {
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'Feedback',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Help',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent
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
		}

	});
});