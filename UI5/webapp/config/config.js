

sap.ui.define(
    [
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/resource/ResourceModel"
    ],
    function(UIComponent,JSONModel,ResourceModel){
        "use strict";

        return UIComponent.extend("sap.ui.demo.walkthrough.Component",{
         
            init : function(){
                UIComponent.prototype.init.apply(this,arguments);
                var oData = {
                    recipient:{
                        name: "UI5",
                        baseURL: "http://192.168.12.46:3347",
                        dados:[{"cardCode":1,"cardName":"teste"}]
                    },
                    
                };

                var oModel = new JSONModel(oData);
                this.setModel(oModel,'oData');

                var i18nModel = new ResourceModel({
                    bundleName: "sap.ui.demo.walkthrough.i18n.i18n",
                    supportedLocales:[""],
                    fallbackLocale:""
                });
                this.setModel(i18nModel,"i18n");
                this.getRouter().initialize();
            }
            
        })
    }
)