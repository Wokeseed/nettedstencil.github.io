<!DOCTYPE html>
<html>
<head>
  <title>NETTED STENCIL</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&family=Raleway:wght@700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css" rel="stylesheet">
  <script async src="https://docs.opencv.org/3.4.0/opencv.js" type="text/javascript"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/konva/8.2.4/konva.min.js"></script>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0; /* Remove padding to ensure elements align to the top */
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f0f2f5;
      position: relative;
    }
    .banner {
      width: 100%;
      height: 675px; /* Adjusted height to extend further */
      background-image: url('/LOGOIMAGE.png');
      background-size: cover;
      background-position: center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1; /* Ensure the banner is behind everything */
    }
    .header {
      font-family: 'Raleway', sans-serif;
      font-size: 36px;
      font-weight: bold;
      margin-top: 20px; /* Adjusted to move the header up */
      background: linear-gradient(90deg, #007bff, #00c6ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .canvas-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px; /* Adjusted to move up */
      position: relative;
    }
    .canvas-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px 0; /* Adjusted to move up */
      position: relative;
    }
    .left-canvas-wrapper {
      position: relative;
      left: -350px; /* Adjust this value as needed */
    }
    .right-canvas-wrapper {
      position: relative;
      right: 0px; /* Adjust this value as needed */
    }
    .konva-container {
      margin: 10px;
      border: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .info-text {
      margin: 10px 0 10px; /* Adjusted to move up */
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    .button-container {
      margin-bottom: 10px; /* Adjusted to move up */
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px; /* Adjusted to move up */
    }
    .btn {
      padding: 10px 20px;
      margin: 5px;
    }
    .btn-primary {
      background-color: #007bff;
      border: none;
    }
    .btn-primary:hover {
      background-color: #0056b3;
    }
    .btn-success {
      background-color: #28a745;
      border: none;
    }
    .btn-success:hover {
      background-color: #218838;
    }
    .btn-secondary {
      background-color: #6c757d;
      border: none;
    }
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    @media (min-width: 768px) {
      .canvas-container {
        flex-direction: row;
      }
      .canvas-wrapper {
        margin-right: 20px;
      }
      .export-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 20px;
      }
    }
    /* Custom styles for crop handles */
    .cropper-point {
      width: 50px !important;
      height: 50px !important;
      background-color: blue !important;
      border-radius: 50% !important;
      opacity: 1 !important;
      touch-action: none; /* Ensure better touch handling on mobile */
    }
    /* Ensure modal content fits within the viewport */
    .modal-dialog-centered {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 100%; /* Ensure the modal does not exceed the viewport width */
      margin: 0;
    }
    .modal-content {
      width: 100%; /* Take full width of the viewport */
      max-height: 85vh; /* Ensure the modal does not exceed the viewport height */
      overflow: auto; /* Allow scrolling if content overflows */
    }
    .modal-body {
      display: flex;
      justify-content: center;
      align-items: center;
      max-height: calc(85vh - 60px); /* Adjust based on header/footer height */
      overflow: auto; /* Allow scrolling if content overflows */
    }
    .modal-body img {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
    .modal-footer {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="banner"></div>
  <div class="header">@nettedstencil</div>
  <div class="container">
    <div class="button-container">
      <label class="btn btn-primary">
        Choose Image <input type="file" id="fileInput" accept="image/jpeg, image/png, image/svg+xml" hidden>
      </label>
      <div id="bottomOriginalCanvas" class="konva-container" style="width: 100px; height: 100px; margin-top: 10px;"></div>
    </div>
    <div class="canvas-container">
      <div class="canvas-wrapper left-canvas-wrapper">
        <a id="downloadProcessedBtn" class="btn btn-success btn-sm" download="processed_stencil.svg">Download</a>
        <div class="info-text">↓ What it sprays ↓</div>
        <div id="processedCanvas" class="konva-container" style="width: 300px; height: 400px;"></div>
      </div>
      <div class="canvas-wrapper right-canvas-wrapper">
        <a id="downloadInvertedBtn" class="btn btn-secondary btn-sm" download="inverted_stencil.svg">Download Inverted</a>
        <div class="info-text">↓ Your stencil ↓</div>
        <div id="invertedCanvas" class="konva-container" style="width: 300px; height: 400px;"></div>
      </div>
      <div class="export-container" id="exportContainer">
        <!-- Exported image will be displayed here -->
      </div>
    </div>
    <div id="originalCanvas" class="konva-container" style="display: none;"></div>
  </div>

  <!-- Modal for image cropping -->
  <div class="modal fade" id="cropperModal" tabindex="-1" role="dialog" aria-labelledby="cropperModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 90%;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cropperModalLabel">Crop Image</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img id="imageToCrop" src="" alt="Image for cropping">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="cropButton">Crop</button>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/521/fabric.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
  <script>
    window.addEventListener('load', function() {
      var originalStage = new Konva.Stage({
        container: 'originalCanvas',
        width: 3000,
        height: 3000
      });
      var originalLayer = new Konva.Layer();
      originalStage.add(originalLayer);

      var processedStage = new Konva.Stage({
        container: 'processedCanvas',
        width: 600,
        height: 800
      });
      var processedLayer = new Konva.Layer();
      processedStage.add(processedLayer);

      var invertedStage = new Konva.Stage({
        container: 'invertedCanvas',
        width: 600,
        height: 800
      });
      var invertedLayer = new Konva.Layer();
      invertedStage.add(invertedLayer);

      var bottomOriginalStage = new Konva.Stage({
        container: 'bottomOriginalCanvas',
        width: 200,
        height: 200
      });
      var bottomOriginalLayer = new Konva.Layer();
      bottomOriginalStage.add(bottomOriginalLayer);

      var cropper;
      var originalImage, processedImage, invertedImage, bottomOriginalImage;
      var cropperModal = $('#cropperModal');
      var imageToCrop = document.getElementById('imageToCrop');
      var fileInput = document.getElementById('fileInput');
      var exportContainer = document.getElementById('exportContainer');

      function loadDefaultImage() {
        Konva.Image.fromURL('/kirby-picture.jpg', function(img) {
          scaleAndCenterImage(img, originalLayer);
          originalLayer.add(img);
          originalLayer.draw();
          processImage(img);
          showBottomOriginalImage(img);
        });
      }

      function scaleAndCenterImage(img, layer) {
        var aspectRatio = img.width() / img.height();
        var canvasAspectRatio = layer.width() / layer.height();
        var scaleFactor;

        if (canvasAspectRatio > aspectRatio) {
          scaleFactor = layer.height() / img.height();
        } else {
          scaleFactor = layer.width() / img.width();
        }

        img.width(img.width() * scaleFactor);
        img.height(img.height() * scaleFactor);
        img.position({
          x: (layer.width() - img.width()) / 2,
          y: (layer.height() - img.height()) / 2
        });

        layer.add(img);
        layer.draw();
      }

      function processImage(img) {
        var imgElement = document.createElement('img');
        imgElement.src = img.toDataURL();
        imgElement.onload = function() {
          var tempCanvas = document.createElement('canvas');
          var tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = imgElement.width;
          tempCanvas.height = imgElement.height;
          tempCtx.fillStyle = "white";
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(imgElement, 0, 0);

          var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          var data = imageData.data;
          for (var i = 0; i < data.length; i += 4) {
            var grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
            var value = grayscale > 128 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = value;
          }
          tempCtx.putImageData(imageData, 0, 0);

          Konva.Image.fromURL(tempCanvas.toDataURL(), function(filteredImg) {
            scaleAndCenterImage(filteredImg, processedLayer);
            processedLayer.add(filteredImg);
            processedLayer.draw();
            invertImage(filteredImg); // Automatically invert the image once processed
          });
        };
      }

      function showBottomOriginalImage(img) {
        Konva.Image.fromURL(img.toDataURL(), function(originalImgCopy) {
          scaleAndCenterImage(originalImgCopy, bottomOriginalLayer);
          bottomOriginalLayer.add(originalImgCopy);
          bottomOriginalLayer.draw();
        });
      }

      function invertImage(img) {
        var imgElement = document.createElement('img');
        imgElement.src = img.toDataURL();
        imgElement.onload = function() {
          var tempCanvas = document.createElement('canvas');
          var tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = imgElement.width;
          tempCanvas.height = imgElement.height;
          tempCtx.drawImage(imgElement, 0, 0);

          var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          var data = imageData.data;
          for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];       // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
          }
          tempCtx.putImageData(imageData, 0, 0);

          // Add a thick black border around the inverted image
          var borderThickness = 20; // Adjust the thickness as needed
          var borderedCanvas = document.createElement('canvas');
          borderedCanvas.width = tempCanvas.width + borderThickness * 2;
          borderedCanvas.height = tempCanvas.height + borderThickness * 2;
          var borderedCtx = borderedCanvas.getContext('2d');

          // Fill the border area with black
          borderedCtx.fillStyle = 'black';
          borderedCtx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);

          // Draw the inverted image onto the bordered canvas
          borderedCtx.drawImage(tempCanvas, borderThickness, borderThickness);

          Konva.Image.fromURL(borderedCanvas.toDataURL(), function(invertedImgWithBorder) {
            scaleAndCenterImage(invertedImgWithBorder, invertedLayer);
            invertedLayer.add(invertedImgWithBorder);
            invertedLayer.draw();

            // Automatically convert to SVG and update download links
            updateSVGDownloadLinks();
          });
        };
      }

      function updateSVGDownloadLinks() {
        convertToSVG(processedLayer.toDataURL(), function(svg) {
          document.getElementById('downloadInvertedBtn').href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
          displaySVGInCanvas(svg, processedLayer);
        });

        convertToSVG(invertedLayer.toDataURL(), function(svg) {
          document.getElementById('downloadProcessedBtn').href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
          displaySVGInCanvas(svg, invertedLayer);
        });
      }

      fileInput.addEventListener('change', function(e) {
        clearCanvases(); // Clear previous images before adding a new one
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
          imageToCrop.src = event.target.result;
          cropperModal.modal('show');
        };
        reader.readAsDataURL(file);
      });

      cropperModal.on('shown.bs.modal', function() {
        cropper = new Cropper(imageToCrop, {
          aspectRatio: NaN,
          viewMode: 1,
          autoCropArea: 1,
          ready: function () {
            this.cropper.setCropBoxData(this.cropper.getCanvasData());
          }
        });
        addTouchListeners();
      }).on('hidden.bs.modal', function() {
        removeTouchListeners();
        cropper.destroy();
        cropper = null;
        fileInput.value = ''; // Reset the file input value
      });

      document.getElementById('cropButton').addEventListener('click', function() {
        var canvas = cropper.getCroppedCanvas();
        var dataURL = canvas.toDataURL('image/png');
        Konva.Image.fromURL(dataURL, function(img) {
          scaleAndCenterImage(img, originalLayer);
          originalLayer.add(img);
          originalLayer.draw();
          processImage(img);
          showBottomOriginalImage(img);
          cropperModal.modal('hide');
        });
      });

      function addTouchListeners() {
        window.addEventListener('touchmove', preventDefault, { passive: false });
      }

      function removeTouchListeners() {
        window.removeEventListener('touchmove', preventDefault, { passive: false });
      }

      function preventDefault(e) {
        e.preventDefault();
      }

      function clearCanvases() {
        originalLayer.clear();
        processedLayer.clear();
        invertedLayer.clear();
        bottomOriginalLayer.clear();
      }

      function convertToSVG(dataURL, callback) {
        var formData = new FormData();
        formData.append('image', dataURLToBlob(dataURL), 'image.png');

        fetch('/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.text())
        .then(svg => callback(svg))
        .catch(error => console.error('Error:', error));
      }

      function displaySVGInCanvas(svg, layer) {
        var img = new Image();
        img.onload = function() {
          var konvaImg = new Konva.Image({
            image: img,
            width: img.width,
            height: img.height
          });
          scaleAndCenterImage(konvaImg, layer);
          layer.clear();
          layer.add(konvaImg);
          layer.draw();
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      }

      function dataURLToBlob(dataURL) {
        var parts = dataURL.split(','), mime = parts[0].match(/:(.*?);/)[1];
        var binary = atob(parts[1]), array = [];
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
      }

      // Load default image on page load
      loadDefaultImage();
    });
  </script>
</body>
</html>
