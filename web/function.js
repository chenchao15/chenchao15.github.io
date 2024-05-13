
var scene = null;
var camera = null;
var renderer = null;
var mesh = null;
var id = null;
var init_name = null;

function init(path) {
	console.log(path)
    CANVAS_WIDTH = 1520;
    CANVAS_HEIGHT = 700;
    var test = window.location.href;
    var m = test.split('#');
	name = path
    //name = 'sucaiku/' + m[2] + '/' + m[1] + '/models/model_normalized.obj';
    //mtlname = 'sucaiku/' + m[2] + '/' + m[1] + '/models/model_normalized2.mtl';
	mtlname = path.split('.')[0] + '.mtl'
  var canvas = document.getElementById('mainCanvs')
  renderer = new THREE.WebGLRenderer({//渲染器
    canvas: canvas//画布
  });
  renderer.setClearColor(0xcccc00);//画布颜色
  scene = new THREE.Scene();//创建场景
//   camera = new THREE.OrthographicCamera(-5, 5, 3.75, -3.75, 0.1, 100);//正交投影照相机
  camera = new THREE.PerspectiveCamera( 45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  camera.position.set(0.3, 1, 1);//相机位置
  camera.lookAt(new THREE.Vector3(0, 0, 0));//lookAt()设置相机所看的位置
  scene.add(camera);//把相机添加到场景中
  var loader = new THREE.OBJLoader();//在init函数中，创建loader变量，用于导入模型
  var MTLLoader = new THREE.MTLLoader();
  MTLLoader.load(mtlname, function(materials) {
      // 返回一个包含材质的对象MaterialCreator
      console.log(materials);
      //obj的模型会和MaterialCreator包含的材质对应起来
      loader.setMaterials(materials);  
  })
  loader.load(name, function(obj) {
    obj.scale.set(1.2, 1.2, 1.2);
          mesh = obj;
          scene.add(obj);//返回的组对象插入场景中
      })

  /*loader.load(name, function(obj) {//第一个表示模型路径，第二个表示完成导入后的回调函数，一般我们需要在这个回调函数中将导入的模型添加到场景中
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.side = THREE.DoubleSide;
      }
    });
    obj.scale.set(1.2, 1.2, 1.2);
    mesh = obj;//储存到全局变量中
    scene.add(obj);//将导入的模型添加到场景中
  });*/

  var light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1);
  // var light = new THREE.PointLight(0xffffff);//光源颜色
  light.position.set(20, 10, 5);//光源位置
  scene.add(light);//光源添加到场景中
  document.body.appendChild(renderer.domElement);
  //renderer.render(scene, camera);
  id = setInterval(draw, 20);//每隔20s重绘一次
  var controls = new THREE.OrbitControls(camera,renderer.domElement);//创建控件对象
  controls.addEventListener('change', render);//监听鼠标、键盘事件
}

function init3(path) {
	CANVAS_WIDTH = 1520;
    CANVAS_HEIGHT = 700;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('mainCanvs')});
    renderer.setClearColor(0xcccc00);//画布颜色
	renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    camera.position.set(0.3, 1, 1);//相机位置
    camera.lookAt(new THREE.Vector3(0, 0, 0));//lookAt()设置相机所看的位置
    scene.add(camera);//把相机添加到场景中
  
    const loader = new THREE.OBJLoader();
    loader.load(
        path, // URL to the OBJ file
        function (obj) { // called when resource is loaded
			mesh = obj;
            scene.add(obj);
            camera.position.set(0, 0, 5);
            animate();
        },
        function (xhr) { // called when loading is in progresses
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) { // called when loading has errors
            console.error('An error happened', error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

function render() {
  renderer.render(scene, camera);//执行渲染操作
}


function draw() {//们在重绘函数中让茶壶旋转：
  // renderer.render(scene, camera);//调用WebGLRenderer的render函数刷新场景
  render();
}


function getFile1(){
    $("#getF1").click();
}

var filename="";
function clickF1() {
    filename=$("#getF1").val();
    console.log(filename);
    var filenames=filename.split("\\");
    filename=filenames[filenames.length-1];
    filename = filename.split('.')[0];
	//console.log(filename);
    // $("#lb").text("OK了");
    lowfile = "object/pinyu/othercase/" + filename + '.glb'
    var modelviewer = document.getElementById('low1');
	modelviewer.setAttribute('src', lowfile);

    highfile = "object/pinyu/othercase/" + filename + '_out.glb'
    var modelviewer = document.getElementById('high1');
	modelviewer.setAttribute('src', highfile);
}

function getFile2(){
    $("#getF2").click();
}

var filename="";
function clickF2() {
    filename=$("#getF2").val();
    console.log(filename);
    var filenames=filename.split("\\");
    filename=filenames[filenames.length-1];
    filename = filename.split('.')[0];
	//console.log(filename);
    // $("#lb").text("OK了");
    lowfile = "object/lpi/othercase/" + filename + '.glb'
    var modelviewer = document.getElementById('global1');
	modelviewer.setAttribute('src', lowfile);

    highfile = "object/lpi/othercase/" + filename + '_local.glb'
    var modelviewer = document.getElementById('local1');
	modelviewer.setAttribute('src', highfile);
}

function getFile3(){
    $("#getF3").click();
}

var filename="";
function clickF3() {
    filename=$("#getF3").val();
    console.log(filename);
    var filenames=filename.split("\\");
    filename=filenames[filenames.length-1];
    filename = filename.split('.')[0];
	//console.log(filename);
    // $("#lb").text("OK了");
    lowfile = "object/neuraltps/othercase/" + filename + '.glb'
    var modelviewer = document.getElementById('sparse1');
	modelviewer.setAttribute('src', lowfile);

    highfile = "object/neuraltps/othercase/" + filename + '_out.glb'
    var modelviewer = document.getElementById('out1');
	modelviewer.setAttribute('src', highfile);
}

function getFile4(){
    $("#getF4").click();
}

var filename="";
function clickF4() {
    filename=$("#getF4").val();
    console.log(filename);
    var filenames=filename.split("\\");
    filename=filenames[filenames.length-1];
    filename = filename.split('.')[0];
	//console.log(filename);
    // $("#lb").text("OK了");
    lowfile = "object/gp/othercase/" + filename + '.glb'
    var modelviewer = document.getElementById('fast1');
	modelviewer.setAttribute('src', lowfile);
}


