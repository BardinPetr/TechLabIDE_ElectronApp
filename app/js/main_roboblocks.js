if (window.roboblocksLanguage === undefined ||
  window.roboblocksLanguage == null) {
  var roboblocksLanguage = 'ru';
}

function rb_update() {
  $('.blocklySvg, #blockly').height('100%');
  $('.blocklySvg').width('100%');
  $('#code').height('100%');
  $('#code').width('33%');
  $('.blocklyTreeRow').height("26px");
  $('.blocklyTreeRow').css("line-height", "26px");
}

function roboblocks_init(colors) {
  RoboBlocks.load({
    zoom: 0.5
  });

  var el = document.getElementById('blockly');
  Blockly.inject(el, {
    toolbox: Blockly.createToolbox()
  });

  Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(),
    document.getElementById('startBlocks'));

  rb_update();

  var _colors = [
    "",
    RoboBlocks.LANG_COLOUR_VARIABLES,
    RoboBlocks.LANG_COLOUR_LOGIC,
    RoboBlocks.LANG_COLOUR_CONTROL,
    RoboBlocks.LANG_COLOUR_ADVANCED,
    RoboBlocks.LANG_COLOUR_PROCEDURES,
    RoboBlocks.LANG_COLOUR_MATH,
    RoboBlocks.LANG_COLOUR_COMMUNICATION,
    RoboBlocks.LANG_COLOUR_LCD,
    RoboBlocks.LANG_COLOUR_SERVO,
    RoboBlocks.LANG_COLOUR_TEXT,
    RoboBlocks.LANG_COLOUR_BQ,
    RoboBlocks.LANG_COLOUR_ZUM
  ];
  if (colors === null) {
    colors = _colors;
  }

  $('.blocklyTreeRow').each(function(i, e) {
    $(e).prepend('<span class="treeLabelBlock" style="background-color:' + colors[i] + '"></span>');
  });

  Blockly.addChangeListener(function() {
    $('#code').html('<code class="c++" style="background-color: #23241f;"><pre style="border: none;">' +
      escapeCode(Blockly.Arduino.workspaceToCode()) +
      '</pre></code>');

    $("pre").each(function(i, e) {
      hljs.highlightBlock(e);
    });
  });
}

function toogleCode() {
  if ($('#code').css('display') == 'none') {
    $('#code').show();
    $('#blockly').width('66%');
  } else {
    $('#code').hide();
    $('#blockly').width('100%');
  }
  Blockly.fireUiEvent(window, "resize");
}


function hideAll() {
  $('#code').fadeOut();
  $('#blockly').fadeOut(2000);
}

function showAll() {
  $('#code').fadeIn(2000);
  $('#blockly').fadeIn(2000);
}

function escapeCode(code) {
  var str = code;
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  return str;
}

function resetWorkspace() {
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(),
    document.getElementById('startBlocks'));
}

function _get_code() {
  return Blockly.Arduino.workspaceToCode();
}

function get_code() {
  return escapeCode(Blockly.Arduino.workspaceToCode());
}

function get_xml() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  var data = Blockly.Xml.domToText(xml);
  return data;
}

function set_xml(data) {
  resetWorkspace();
  var xml = Blockly.Xml.textToDom("<xml xmlns='http://www.w3.org/1999/xhtml'></xml>");
  Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
  var xml2 = Blockly.Xml.textToDom(data);
  Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml2);
}
