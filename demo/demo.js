(function() {

  $$('.tabs').forEach(function(el) {
    var pre = el.dataset.prefix;
    var types = ['preview', 'js', 'html', 'css'];

    var tabList = document.createElement('ul');
    tabList.classList.add('tabs__list');
    tabList.innerHTML = [
      '<li data-type="preview">',
        '<a href="#', pre, '-preview">preview</a>',
      '</li>'
    ].join('');

    var preview = document.createElement('div');
    preview.innerHTML = $('#' + pre + '-html code', el).innerHTML;
    preview.classList.add('tabs__content');
    preview.dataset.type = 'preview';
    preview.id = pre + '-preview';

    types.forEach(function(type) {
      var tab;

      if ((tab = $('#' + pre + '-' + type, el))) {
        var code = $('pre code', tab);
        tab.dataset.type = type;
        
        if (type == 'js') {
          var tag = document.createElement('script');
          tag.innerHTML = code.innerHTML;
          preview.appendChild(tag);
        } else if (type == 'css') {
          var tag = document.createElement('style');
          tag.innerHTML = code.innerHTML;
          prependChild(preview, tag);
        }

        tabList.innerHTML += [
          '<li data-type="', type, '">',
            '<a href="#', pre, '-', type, '">', type, '</li>',
          '</li>'
        ].join('');
      }
    });

    tabList.addEventListener('click', function(e) {
      if (e.target.tagName.toLowerCase() == 'a') {
        types.forEach(function(t) { el.classList.remove('show-' + t); });
        el.classList.add('show-' + e.target.parentNode.dataset.type);
        e.preventDefault();
      }
    }, false);

    el.classList.add(el.classList.contains('tabs--full') ? 'show-preview' : 'show-js');
    prependChild(el.firstElementChild, preview);
    prependChild(el, tabList);
  });

  $$('pre[class^=language-] > code').forEach(function(code) {
    code.innerHTML = whiteSpace(code.innerHTML);
  });

  $$('pre.language-html > code').forEach(function(code) {
    code.innerHTML = htmlEntities(code.innerHTML);
  });

  var resizeTimeout;
  var resizeHandler = function() {
    $$('.tabs__content[data-type=preview]').forEach(function(tab) {
      $$('.tabs__content', tab.parentNode).forEach(function(t) {
        t.style.height = tab.scrollHeight + 'px';
      });
    });
  };

  resizeHandler();
  window.addEventListener('resize', function() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeHandler, 100);
  }, false);

  function $(selector, ctx) {
    return (ctx||document).querySelector(selector);
  }

  function $$(selector, ctx) {
    return Array.prototype.slice.call((ctx||document).querySelectorAll(selector));
  }

  function prependChild(parent, node) {
    parent.insertBefore(node, parent.firstChild);
  }

  function htmlEntities(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function whiteSpace(str) {
    var shortest = 100;
    var i = 0;

    var lines = str.split('\n');
    if (!lines[0]) lines.shift();

    for (i in lines) {
      if (lines[i]) {
        var len = lines[i].replace(/(^\s*)\S.*$/, '$1').length;
        if (len < shortest) shortest = len;
      }
    }

    for (i in lines) {
      if (lines[i]) {
        lines[i] = lines[i].substr(shortest);
      }
    }

    return lines.join('\n');
  }
})();