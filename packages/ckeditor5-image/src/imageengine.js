/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '../core/plugin.js';
import buildModelConverter from '../engine/conversion/buildmodelconverter.js';
import WidgetEngine from './widget/widgetengine.js';
import { modelToViewImage, viewToModelImage, modelToViewSelection } from './converters.js';
import { toImageWidget } from './utils.js';

/**
 * The image engine plugin.
 * Registers `image` as a block element in document's schema and allows it to have two attributes: `src` and `alt`.
 * Registers converters for editing and data pipelines.
 *
 * @memberof image
 * @extends core.Plugin.
 */
export default class ImageEngine extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ WidgetEngine ];
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const doc = editor.document;
		const schema = doc.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Configure schema.
		schema.registerItem( 'image' );
		schema.requireAttributes( 'image', [ 'src' ] );
		schema.allow( { name: 'image', attributes: [ 'alt', 'src' ], inside: '$root' } );
		schema.objects.add( 'image' );

		// Build converter from model to view for data pipeline.
		buildModelConverter().for( data.modelToView )
			.fromElement( 'image' )
			.toElement( ( data ) => modelToViewImage( data.item ) );

		// Build converter from model to view for editing pipeline.
		buildModelConverter().for( editing.modelToView )
			.fromElement( 'image' )
			.toElement( ( data ) => toImageWidget( modelToViewImage( data.item ) ) );

		// Converter for figure element from view to model.
		data.viewToModel.on( 'element:figure', viewToModelImage() );

		// Creates fake selection label if selection is placed around image widget.
		editing.modelToView.on( 'selection', modelToViewSelection( editor.t ), { priority: 'lowest' } );
	}
}
