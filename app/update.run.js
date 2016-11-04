module.exports.load = function (mod) {
  mod.run(run);
};

/** @ngInject */
function run($ionicPopup, $ionicPlatform, $ionicLoading){

  var deploy = new Ionic.Deploy();

  $ionicPlatform.ready(function() {

    if ( $ionicPlatform.is('android') ) {
      checkForUpdate();
    }

  });

  function checkForUpdate(){
    deploy.check().then(function(isDeployAvailable) {

      if(isDeployAvailable){
        deploy.info().then(function(deployInfo) {
          askIfWannaUpdate(deployInfo);
        });
      }

    }, function(deployCheckError) {
      // unable to check for deploy updates
    });
  }


  function askIfWannaUpdate(deployInfo){

    console.log(deployInfo);

    var confirmUpdate =  $ionicPopup.confirm({
      title: 'Atualização disponível',
      template: 'Uma nova versão está disponível, deseja atualizar agora?',
      cancelText: 'Não',
      okText: 'Sim'
    });

    confirmUpdate.then(function(tappedOk) {
      if(tappedOk){
        doUpdate();
      }
    });

  }

  function doUpdate(){

    $ionicLoading.show({
      template: 'Baixando atualização...'
    });

    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
      $ionicLoading.hide();
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
      $ionicLoading.hide();
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  }

}
