'use strict';
/* global angular, describe, it, expect, module, inject, beforeEach */

describe('The fazenda module', function(){

    beforeEach( module('fazenda') );

    it('has these requirements', function() {

        var fazendaModule = angular.module('fazenda');

        expect(fazendaModule.requires.length).toBe(10);

        expect(fazendaModule.requires).toContain('ngRoute');
        expect(fazendaModule.requires).toContain('fazendaServices');
        expect(fazendaModule.requires).toContain('compiledTemplates');
    });

    describe('The fazenda controller', function() {
        var scope;

        beforeEach(inject(function ($rootScope, $controller, fazendaServices) {
            scope = $rootScope.$new();
            _fazendaServices = fazendaServices;

        }));
    });
});
