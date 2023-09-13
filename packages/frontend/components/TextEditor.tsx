'use client';
import { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { NotFoundError } from '@/lib/exceptions';

const SAVE_INTERVAL = 2000;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ['clean'],
  ['link', 'image', 'video'],
  ['image', 'blockquote', 'code-block'],
];

const TextEditor = ({ slug }: any) => {
  const [socket, setSocket]: any = useState();
  const [quill, setQuill]: any = useState();
  const [NotFound, setNotFound] = useState(false);
  useEffect(() => {
    const s: any = io('http://localhost:3001');
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any, oldDelta: any, source: any) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', (document: any) => {
      if (!document.error) {
        quill.setContents(document);
        quill.enable();
      } else if (document.error == 404) {
        setNotFound(true);
      }
    });

    socket.emit('get-document', slug);
  }, [socket, quill, slug]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  const wrapper = useCallback((wrapper: any) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q: any = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  if (NotFound) throw new NotFoundError();

  return <div className="container" ref={wrapper}></div>;
};

export default TextEditor;
