// Test script to verify canvas functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Testing canvas functionality...');
  
  // Get the canvas element
  const canvas = document.getElementById('canvas');
  
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }
  
  console.log('Canvas dimensions:', canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight);
  
  // Try to get a 2D context
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context!');
      return;
    }
    
    console.log('Successfully got 2D context');
    
    // Draw a simple test pattern
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(10, 10, 50, 50);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(70, 10, 50, 50);
    
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(130, 10, 50, 50);
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText('Canvas Test', 10, 100);
    
    console.log('Test pattern drawn successfully');
    
    // Update debug element
    const debugElement = document.getElementById('canvas-debug');
    if (debugElement) {
      debugElement.innerHTML = 'Canvas test successful!';
    }
  } catch (e) {
    console.error('Error drawing to canvas:', e);
    
    // Update debug element
    const debugElement = document.getElementById('canvas-debug');
    if (debugElement) {
      debugElement.innerHTML = 'Canvas error: ' + e.message;
    }
  }
});
