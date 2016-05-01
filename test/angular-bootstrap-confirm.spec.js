'use strict';

/* eslint-disable angular/angularelement */

require('./../src/angular-bootstrap-confirm.js');
var $ = require('jquery');
var angular = require('angular');
require('angular-mocks');

describe('Confirm popover', function() {
  beforeEach(angular.mock.module('mwl.confirm'));

  beforeEach(angular.mock.module(function($provide) {

    $provide.factory('$uibPosition', function() {
      return {
        positionElements: function() {
          return {
            top: 10,
            left: 50
          };
        }
      };
    });
  }));

  function getConfirmButton(popover) {
    return $(popover).find('.confirm-button');
  }

  function getCancelButton(popover) {
    return $(popover).find('.cancel-button');
  }

  describe('PopoverConfirmCtrl', function() {

    var scope, element, popover, $injector, $controller, ctrl;

    beforeEach(inject(function(_$controller_, $rootScope, _$injector_) {
      $injector = _$injector_;
      $controller = _$controller_;
      var body = $('body');
      scope = $rootScope.$new();
      element = angular.element('<button>Test</button>');
      body.append(element);
      ctrl = $controller('PopoverConfirmCtrl', {
        $scope: scope,
        $element: element,
        $attrs: {
          isDisabled: 'isDisabled'
        }
      });
      scope.$apply();
      popover = body.find('.popover:first');

    }));

    afterEach(function() {
      scope.$destroy();
    });

    it('should use the $position service if the $uibPosition service is not available', function() {
      $injector.has = sinon.stub().withArgs('$uibPosition').returns(false);
      sinon.spy($injector, 'get');
      $controller('PopoverConfirmCtrl', {
        $scope: scope,
        $element: element,
        $attrs: {}
      });
      scope.$apply();
      expect($injector.get).to.have.been.calledWith('$position');
    });

    describe('showPopover', function() {

      it('should show the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        ctrl.showPopover();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should not show the popover when isDisabled is true', function() {
        scope.isDisabled = true;
        expect(popover.is(':visible')).to.be.false;
        ctrl.showPopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('hidePopover', function() {

      it('should hide the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        ctrl.showPopover();
        expect(popover.is(':visible')).to.be.true;
        ctrl.hidePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('togglePopover', function() {

      it('should show the popover if hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        ctrl.togglePopover();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover if visible', function() {
        ctrl.showPopover();
        expect(popover.is(':visible')).to.be.true;
        ctrl.togglePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('positionPopover', function() {

      beforeEach(function() {
        ctrl.showPopover();
      });

      it('should set the top css property', function() {
        //really hacky, not sure why .offset, .position or .css('top') return different value
        expect(popover.attr('style').indexOf('top: 10px') > -1).to.be.true;
      });

      it('should set the left css property', function() {
        expect(popover.attr('style').indexOf('left: 50px') > -1).to.be.true;
      });

    });

    describe('element click', function() {

      it('should show the popover when the element is clicked and the element is hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        $(element).click();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover when the element is clicked and the element is visible', function() {
        ctrl.showPopover();
        expect(popover.is(':visible')).to.be.true;
        $(element).click();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('$destroy', function() {

      it('should remove the popover when the scope is destroyed', function() {
        scope.$destroy();
        expect($('body').find('.popover').size()).to.equal(0);
      });

    });

  });

  describe('mwlConfirmDirective', function() {

    var element, scope, $compile, $timeout, $document;

    beforeEach(inject(function(_$compile_, $rootScope, _$timeout_, _$document_) {
      scope = $rootScope.$new();
      $compile = _$compile_;
      $timeout = _$timeout_;
      $document = _$document_;
    }));

    afterEach(function() {
      scope.$destroy();
      $('body').find('.popover').remove();
    });

    function createPopover(htmlString) {
      element = angular.element(htmlString);
      $compile(element)(scope);
      scope.$apply();
      return $('body').find('.popover:first');
    }

    it('should set the default confirm text', function() {

      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect(getConfirmButton(popover).text()).to.equal('Confirm');

    });

    it('should set the confirm text when specified', function() {
      var popover = createPopover('<button mwl-confirm confirm-text="Different confirm text">Test</button>');
      expect(getConfirmButton(popover).text()).to.equal('Different confirm text');
    });

    it('should set the default cancel text', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect(getCancelButton(popover).text()).to.equal('Cancel');
    });

    it('should set the cancel text when specified', function() {
      var popover = createPopover('<button mwl-confirm cancel-text="Different cancel text">Test</button>');
      expect(getCancelButton(popover).text()).to.equal('Different cancel text');
    });

    it('should set the popover message', function() {
      var popover = createPopover('<button mwl-confirm message="Message">Test</button>');
      expect($(popover).find('.popover-content > p').text()).to.equal('Message');
    });

    it('should allow html in the popover message', function() {
      scope.message = '<b>Message<b>';
      var popover = createPopover('<button mwl-confirm message="{{ message }}">Test</button>');
      expect($(popover).find('.popover-content > p > b').size()).to.equal(1);
    });

    it('should set the popover title', function() {
      var popover = createPopover('<button mwl-confirm title="Title">Test</button>');
      expect($(popover).find('.popover-title').text()).to.equal('Title');
    });

    it('should allow html in the popover title', function() {
      scope.title = '<b>Title<b>';
      var popover = createPopover('<button mwl-confirm title="{{ title }}">Test</button>');
      expect($(popover).find('.popover-title > b').size()).to.equal(1);
    });

    it('should set the default placement to top', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).hasClass('top')).to.be.true;
    });

    it('should set the placement when specified', function() {
      var popover = createPopover('<button mwl-confirm placement="left">Test</button>');
      expect($(popover).hasClass('left')).to.be.true;
    });

    it('should call onConfirm when the confirm button is clicked', function() {
      scope.onConfirm = sinon.spy();
      var popover = createPopover('<button mwl-confirm on-confirm="onConfirm()">Test</button>');
      getConfirmButton(popover).click();
      expect(scope.onConfirm).to.have.been.called;
    });

    it('should call onCancel when the cancel button is clicked', function() {
      scope.onCancel = sinon.spy();
      var popover = createPopover('<button mwl-confirm on-cancel="onCancel()">Test</button>');
      getCancelButton(popover).click();
      expect(scope.onCancel).to.have.been.called;
    });

    it('should set the default confirm button class to success', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect(getConfirmButton(popover).hasClass('btn-success')).to.be.true;
    });

    it('should allow html in the confirm button text', function() {
      scope.confirmButtonText = '<b>Confirm</b>';
      var popover = createPopover('<button mwl-confirm confirm-text="{{ confirmButtonText }}">Test</button>');
      expect(getConfirmButton(popover).find('b').size()).to.equal(1);
    });

    it('should set confirm button class when specified', function() {
      var popover = createPopover('<button mwl-confirm confirm-button-type="warning">Test</button>');
      expect(getConfirmButton(popover).hasClass('btn-warning')).to.be.true;
    });

    it('should set the default cancel button class to default', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect(getCancelButton(popover).hasClass('btn-default')).to.be.true;
    });

    it('should set cancel button class when specified', function() {
      var popover = createPopover('<button mwl-confirm cancel-button-type="warning">Test</button>');
      expect(getCancelButton(popover).hasClass('btn-warning')).to.be.true;
    });

    it('should allow html in the cancel button text', function() {
      scope.cancelButtonText = '<b>Cancel</b>';
      var popover = createPopover('<button mwl-confirm cancel-text="{{ cancelButtonText }}">Test</button>');
      expect(getCancelButton(popover).find('b').size()).to.equal(1);
    });

    it('should close the popover when another element that isn\'t the popover is clicked', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).is(':visible')).to.be.false;
      $(element).click();
      expect($(popover).is(':visible')).to.be.true;
      var otherButton = $('<button></button>');
      $('body').append(otherButton);
      otherButton.click();
      scope.$apply();
      expect($(popover).is(':visible')).to.be.false;
    });

    it('should keep the popover open when an element inside the popover is clicked', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      $(element).click();
      expect($(popover).is(':visible')).to.be.true;
      $(popover).find('.popover-title').click();
      scope.$apply();
      expect($(popover).is(':visible')).to.be.true;
    });

    it('should close the popover when the confirm button is clicked', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      $(element).click();
      expect($(popover).is(':visible')).to.be.true;
      getConfirmButton(popover).click();
      scope.$apply();
      expect($(popover).is(':visible')).to.be.false;
    });

    it('should close the popover when the cancel button is clicked', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      $(element).click();
      expect($(popover).is(':visible')).to.be.true;
      getCancelButton(popover).click();
      scope.$apply();
      expect($(popover).is(':visible')).to.be.false;
    });

    describe('is-open', function() {

      it('should be true when the popover becomes visible', function() {
        createPopover('<button mwl-confirm is-open="isOpen">Test</button>');
        expect(scope.isOpen).to.be.undefined;
        $(element).click();
        expect(scope.isOpen).to.be.true;
      });

      it('should open the popover when set to true', function() {
        var popover = createPopover('<button mwl-confirm is-open="isOpen">Test</button>');
        expect($(popover).is(':visible')).to.be.false;
        scope.isOpen = true;
        $timeout.flush();
        expect($(popover).is(':visible')).to.be.true;
      });

      it('should not mark isOpen as true when the popover is disabled', function() {
        scope.isOpen = false;
        createPopover('<button mwl-confirm is-open="isOpen" is-disabled="true">Test</button>');
        $(element).click();
        expect(scope.isOpen).to.be.false;
      });

    });

    function expectToHaveFocus(target) {
      // Unfortunately phantomjs won't work with target.is(':focus'). See https://github.com/ariya/phantomjs/issues/10427
      expect(target[0]).to.equal($document[0].activeElement);
    }

    it('should not focus either button by default', function() {
      createPopover('<button mwl-confirm>Test</button>');
      var otherButton = $('<button></button>');
      $('body').append(otherButton);
      otherButton.focus();
      $(element).click();
      scope.$apply();
      expectToHaveFocus(otherButton);
    });

    it('should focus on the confirm button when the popover is opened', function() {
      var popover = createPopover('<button mwl-confirm focus-button="confirm">Test</button>');
      $(element).click();
      scope.$apply();
      expectToHaveFocus($(popover).find('button.confirm-button'));
    });

    it('should focus on the cancel button when the popover is opened', function() {
      var popover = createPopover('<button mwl-confirm focus-button="cancel">Test</button>');
      $(element).click();
      scope.$apply();
      expectToHaveFocus($(popover).find('button.cancel-button'));
    });

    it('should have confirm button on the left with default popover template', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      var confirmButton = $($(popover).find('button')[0]).text();
      var cancelButton = $($(popover).find('button')[1]).text();
      expect(confirmButton).to.equal('Confirm');
      expect(cancelButton).to.equal('Cancel');
    });

    it('should allow the popover default template url to be changed', inject(function($templateCache, confirmationPopoverDefaults) {
      var customTemplateUrl = 'my-custom-popover.html';
      var customTemplate = '<div class="popover">Custom</div>';
      $templateCache.put(customTemplateUrl, customTemplate);
      var originalUrl = confirmationPopoverDefaults.templateUrl;
      confirmationPopoverDefaults.templateUrl = customTemplateUrl;
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect(popover.html()).to.equal('Custom');
      confirmationPopoverDefaults.templateUrl = originalUrl;
    }));

    it('should allow a per instance template url to be set', inject(function($templateCache) {
      var customTemplateUrl = 'my-custom-popover.html';
      var customTemplate = '<div class="popover">Instance template</div>';
      $templateCache.put(customTemplateUrl, customTemplate);
      var popover = createPopover('<button mwl-confirm template-url="' + customTemplateUrl + '">Test</button>');
      expect(popover.html()).to.equal('Instance template');
    }));

  });

});
