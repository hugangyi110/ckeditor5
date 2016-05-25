/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import moduleUtils from '/tests/ckeditor5/_utils/module.js';

import View from '/ckeditor5/ui/view.js';
import Controller from '/ckeditor5/ui/controller.js';
import ControllerCollection from '/ckeditor5/ui/controllercollection.js';

/**
 * General test utils for CKEditor.
 */
const utils = {
	/**
	 * Creates Sinon sandbox in {@link bender#sinon} and plugs `afterEach()` callback which
	 * restores all spies and stubs created in this sandbox.
	 *
	 * See https://github.com/ckeditor/ckeditor5-design/issues/72 and http://sinonjs.org/docs/#sinon-sandbox
	 *
	 * Usage:
	 *
	 *		// Directly in the test file:
	 *		testUtils.createSinonSandbox();
	 *
	 *		// Then inside tests you can use bender.sinon:
	 *		it( 'does something', () => {
	 *			testUtils.sinon.spy( obj, 'method' );
	 *		} );
	 */
	createSinonSandbox() {
		before( () => {
			utils.sinon = sinon.sandbox.create();
		} );

		afterEach( () => {
			utils.sinon.restore();
		} );
	},

	/**
	 * Defines CKEditor plugin which is a mock of an editor creator.
	 *
	 * The mocked creator is available under:
	 *
	 *		editor.plugins.get( 'creator-thename' );
	 *
	 * @param {String} creatorName Name of the creator.
	 * @param {Object} [proto] Prototype of the creator. Properties from the proto param will
	 * be copied to the prototype of the creator.
	 */
	defineEditorCreatorMock( creatorName, proto ) {
		moduleUtils.define( `creator-${ creatorName }/creator-${ creatorName }`, [ 'creator/creator' ], ( Creator ) => {
			class TestCreator extends Creator {}

			if ( proto ) {
				for ( let propName in proto ) {
					TestCreator.prototype[ propName ] = proto[ propName ];
				}
			}

			return TestCreator;
		} );
	},

	/**
	 * Returns UI controller for given region/DOM selector pairs, which {@link ui.Controller#view}
	 * is `document.body`. It is useful for manual tests which engage various UI components and/or
	 * UI {@link ui.Controller} instances, where initialization and the process of insertion into
	 * DOM could be problematic i.e. because of the number of instances.
	 *
	 * Usage:
	 *
	 *		// Get the controller.
	 *		const controller = testUtils.createTestUIController();
	 *
	 *		// Then use it to organize and initialize children.
	 *		controller.add( 'some-collection', childControllerInstance );
	 *
	 * @param {Object} regions An object literal with `regionName: DOM Selector pairs`.
	 * See {@link ui.View#register}.
	 */
	createTestUIController( regions ) {
		const TestUIView = class extends View {
			constructor() {
				super();

				this.element = document.body;

				for ( let r in regions ) {
					this.register( r, regions[ r ] );
				}
			}
		};

		const controller = new Controller( null, new TestUIView() );

		for ( let r in regions ) {
			controller.collections.add( new ControllerCollection( r ) );
		}

		return controller.init().then( () => {
			return controller;
		} );
	}
};

export default utils;
