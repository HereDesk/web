
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'
import quillEditor from 'vue-quill-editor'

Vue.use(quillEditor,{
	modules: {
    	toolbar: [
				// [{ 'header': 1 }, { 'header': 2 }],
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'link','image'],
				[{ 'color': [] }, { 'background': [] }],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'align': [] }],
				['blockquote', 'code-block'],
				[{ 'script': 'sub' }, { 'script': 'super' }],
				['clean'],
				// [{ 'direction': 'rtl' }], 
			]
	},
	placeholder: '请输入内容...'
})