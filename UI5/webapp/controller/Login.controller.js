sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
],function(BaseController,MessageToast,JSONModel,ResourceModel){
    "use strict";
    return BaseController.extend("sap.ui.demo.walkthrough.Login",{
       
        onLoginTap : function(){
			var oUser = this.getView().byId("user").getValue();  //get input value data in oUser variable 
			var oPwd = this.getView().byId("pwd").getValue();    //get input value data in oPwd variable
			
			if(oUser !="" && oPwd != ""){				
                var oRouter = this.getRouter();
                var caminho = "http://192.168.12.46:3347/Login?usuario="+oUser+"&senha="+oPwd;
                var caminho1 = "http://192.168.12.46:3347/Login";
                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    method: "POST",
                    url: caminho,
                    data: {usuario:oUser,senha:oPwd},
                    //crossDomain: true,
                    //processData: true,
                    //headers: {'key1':'value1','key2':'value2'}
                    contentType: "application/json",
                    success: function (res) {
                        console.log(res)
                        localStorage.setItem("token", res.token);
                        localStorage.setItem("dadosUser", JSON.stringify({cdUsuario : res.cdUsuario,nmUsuario : res.nmUsuario}));
                        sap.ui.core.BusyIndicator.hide(0);
                        oRouter.navTo("overview");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        sap.ui.core.BusyIndicator.hide(0);
                      console.log("Got an error response: " + textStatus + errorThrown);
                    }
                })
			}else{
				alert("Re-Enter your Detail");
			}
			
			
		}

    });
});