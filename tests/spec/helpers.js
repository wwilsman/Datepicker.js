beforeEach(function () {
  jasmine.addMatchers({
    toHaveClass: function() {
      return {
        compare: function (ctx, classname) {
          return {
            pass: ctx.classList.contains(classname)
          };
        }
      };
    }
  });
});
