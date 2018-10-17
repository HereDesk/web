
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'
import quillEditor from 'vue-quill-editor'

Vue.use(quillEditor,{
	modules: {
    	toolbar: [
    		// [{ 'header': 1 }, { 'header': 2 }],
    		['bold', 'italic'],
    		[{ 'size': ['small', false, 'large'] }],
    	    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    	    [{ 'align': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            // [{ 'font': [] }],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
    	]
	},
	placeholder: '请输入内容...'
})