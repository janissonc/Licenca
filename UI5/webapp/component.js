sap.ui.define(
    [
        "sap/base/util/UriParameters",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/f/library",
        "sap/ui/model/resource/ResourceModel",
        "sap/f/FlexibleColumnLayoutSemanticHelper"
    ],
    function(UriParameters,UIComponent,JSONModel,library,ResourceModel,FlexibleColumnLayoutSemanticHelper){
        "use strict";
        var LayoutType = library.LayoutType;
        return UIComponent.extend("sap.ui.demo.walkthrough.Component",{
            metadata: {
              manifest:"json"
            },
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
            },
            getHelper: function () {
                var oFCL = this.getRootControl().byId("fcl"),
                    oParams = UriParameters.fromQuery(location.search),
                    oSettings = {
                        defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
                        mode: oParams.get("mode"),
                        maxColumnsCount: oParams.get("max")
                    };
    
                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            }
            
        })
    }
)