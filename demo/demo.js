(function() {

  $$('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      smoothScroll($(this.hash).offsetTop);
      e.preventDefault();
    })
  });

  $$('pre > code').forEach(function(code) {
    code.innerHTML = whiteSpace(code.innerHTML);
  });

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

        if (type == 'html') {
          code.innerHTML = htmlEntities(code.innerHTML);
        } else if (type == 'js') {
          var tag = document.createElement('script');
          tag.innerHTML = htmlEntities(code.innerHTML, true);
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

    var previewFirst = el.classList.contains('tabs--full') || window.innerWidth < 840;
    el.classList.add(previewFirst ? 'show-preview' : 'show-js');
    prependChild(el.firstElementChild, preview);
    prependChild(el, tabList);
  });

  var resizeTimeout;
  var resizeHandler = function() {
    $$('.tabs__content[data-type=preview]').forEach(function(tab) {
      tab.style.height = '';
      tab.style.display = 'block';

      $$('.tabs__content', tab.parentNode).forEach(function(t) {
        t.style.height = (window.innerWidth < 840 ? t.offsetHeight : tab.scrollHeight) + 'px';
      });

      tab.style.display = '';
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

  function htmlEntities(str, reverse) {
    if (reverse) {
      return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

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

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  function smoothScroll(pos) {
    var start = window.pageYOffset;
    var duration = 500;

    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn) { window.setTimeout(fn, 15); };

    var step = function() {
      var elapsed = Date.now() - clock;
      var position =  elapsed < duration ? start + (pos - start) * easeInOutCubic(elapsed / duration) : pos;
      window.scroll(0, position);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }

    step();
  }
})();