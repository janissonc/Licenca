sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.ParceiroNegocio",{
        
        onInit: function(){
            console.log("entrou no init");
            var token =  localStorage.getItem("token");
            if(!token){
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }

            // Control state model
			var oList = this.byId("list"),
            oViewModel = this._createViewModel(),
            // Put down master list's original value for busy indicator delay,
            // so it can be restored later on. Busy handling on the master list is
            // taken care of by the master list itself.
            iOriginalBusyDelay = oList.getBusyIndicatorDelay();

            this._oGroupFunctions = {
                CompanyName: function (oContext) {
                    var sCompanyName = oContext.getProperty("Customer/CompanyName");
                    return {
                        key: sCompanyName,
                        text: sCompanyName
                    };
                },

                OrderDate: function (oContext) {
                    var oDate = oContext.getProperty("OrderDate"),
                        iYear = oDate.getFullYear(),
                        iMonth = oDate.getMonth() + 1,
                        sMonthName = this._oMonthNameFormat.format(oDate);

                    return {
                        key: iYear + "-" + iMonth,
                        text: this.getResourceBundle().getText("masterGroupTitleOrderedInPeriod", [sMonthName, iYear])
                    };
                }.bind(this),

                ShippedDate: function (oContext) {
                    var oDate = oContext.getProperty("ShippedDate");
                    // Special handling needed because shipping date may be empty (=> not yet shipped).
                    if (oDate != null) {
                        var iYear = oDate.getFullYear(),
                            iMonth = oDate.getMonth() + 1,
                            sMonthName = this._oMonthNameFormat.format(oDate);

                        return {
                            key: iYear + "-" + iMonth,
                            text: this.getResourceBundle().getText("masterGroupTitleShippedInPeriod", [sMonthName, iYear])
                        };
                    } else {
                        return {
                            key: 0,
                            text: this.getResourceBundle().getText("masterGroupTitleNotShippedYet")
                        };
                    }
                }.bind(this)
            };
            this._oMonthNameFormat = DateFormat.getInstance({ pattern: "MMMM"});

            this._oList = oList;

            // keeps the filter and search state
            this._oListFilterState = {
                aFilter : [],
                aSearch : []
            };

            this.setModel(oViewModel, "masterView");
            // Make sure, busy indication is showing immediately so there is no
            // break after the busy indication for loading the view's meta data is
            // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
            oList.attachEventOnce("updateFinished", function(){
                // Restore original busy indicator delay for the list
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            });

            this.getView().addEventDelegate({
                onBeforeFirstShow: function () {
                    this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
                }.bind(this)
            });

            this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
            this.getRouter().attachBypassed(this.onBypassed, this);
            
        },

        onAfterRendering: function() {
            console.log("entrou no init");
            var token =  localStorage.getItem("token");
            var teste = [];
            if(token){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.12.46:3347/ParceiroNegocioCompleto",
                    data: {GroupCode:-1},
                    //crossDomain: true,
                    headers: {'Token':token},
                    contentType: "application/json",
                    success: function (res) {
                        teste = res;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log("Got an error response: " + textStatus + errorThrown);
                    }
                }).then(()=>{
                    var oData = {
                        recipient:{
                            name: "UI5",
                            dados:teste
                        },
                        
                    };
                    var oModel = new JSONModel(oData);
                    this.setModel(oModel);
                    
                });
            }
            else{
                console.log("Usuario não logado");
                var oRouter = this.getRouter();
                oRouter.navTo("login");     
            }
        },

    });
});