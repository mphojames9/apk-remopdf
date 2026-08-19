import React, { useEffect, useState, useDeferredValue } from 'react';
import { renderToString } from 'react-dom/server';
import ResumePreview from './ResumePreview';

const PAGE_HEIGHT = 1122; // Strict A4 Height

export default function PaginatedPreview({ data, template }) {
  const [pages, setPages] = useState([]);
  
  // 1. Decouple the data: React will prioritize input typing over updating this value
  const deferredData = useDeferredValue(data);

  useEffect(() => {
    let isCancelled = false; 

    // Increased debounce timer to 1200ms to allow typing to finish without triggering heavy renders
    const debounceTimer = setTimeout(async () => {
      // Use deferredData so the preview renders behind the user's live typing
      const rawHtml = renderToString(<ResumePreview data={deferredData} template={template} />);
      await paginate(rawHtml, () => isCancelled);
    }, 1200);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [deferredData, template]);

  const paginate = async (html, checkCancelled) => {
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.top = '0';
    temp.style.left = '-9999px';
    temp.style.width = '794px'; 
    temp.innerHTML = html;
    document.body.appendChild(temp);

    const root = temp.firstElementChild;
    if (!root) {
      document.body.removeChild(temp);
      return;
    }

    const sidebar = root.querySelector('aside');
    const main = root.querySelector('main');

    if (!sidebar || !main) {
      if (!checkCancelled()) setPages([html]);
      document.body.removeChild(temp);
      return;
    }

    const sidebarQueue = Array.from(sidebar.children);
    const mainQueue = Array.from(main.children);

    temp.removeChild(root);

    let pagesData = [];

    const createNewPage = () => {
      const clone = root.cloneNode(true);
      temp.appendChild(clone);

      const cloneSidebar = clone.querySelector('aside');
      const cloneMain = clone.querySelector('main');
      
      cloneSidebar.innerHTML = '';
      cloneMain.innerHTML = '';

      if (pagesData.length > 0) {
        const header = clone.querySelector('header');
        if (header) header.remove();
        
        const summary = clone.querySelector('#summary-section');
        if (summary) summary.remove();
        
        cloneMain.style.paddingTop = '40px';
        cloneSidebar.style.paddingTop = '40px';
      }

      const pageObj = {
        page: clone,
        sidebar: cloneSidebar,
        main: cloneMain
      };
      
      pagesData.push(pageObj);
      return pageObj;
    };

    let currentPage = createNewPage();
    let pageIndex = 0;

    const processQueue = async (queue, colName) => {
      // Time-slicing: Track when this batch of DOM work started
      let frameStartTime = performance.now();

      while (queue.length > 0) {
        if (checkCancelled()) return false;

        const el = queue.shift();
        let current = pagesData[pageIndex];
        current[colName].appendChild(el);

        // Using scrollHeight to detect overflow for accurate A4 sizing
        if (current.page.scrollHeight > PAGE_HEIGHT) {
          if (current[colName].children.length === 1) {
            pageIndex++;
            if (!pagesData[pageIndex]) createNewPage();
          } else {
            current[colName].removeChild(el);
            pageIndex++;
            if (!pagesData[pageIndex]) createNewPage();
            queue.unshift(el); 
          }
        }

        // Time-slicing check: if we've spent more than 12ms working on the DOM
        if (performance.now() - frameStartTime > 12) {
          // Yield to the main thread so it can process typing/rendering
          await new Promise(resolve => setTimeout(resolve, 0));
          
          // Reset the timer for the next batch of work
          frameStartTime = performance.now();
        }
      }
      pageIndex = 0; 
      return true;
    };

    const sidebarCompleted = await processQueue(sidebarQueue, 'sidebar');
    if (!sidebarCompleted) {
      document.body.removeChild(temp);
      return;
    }

    const mainCompleted = await processQueue(mainQueue, 'main');
    if (!mainCompleted) {
      document.body.removeChild(temp);
      return;
    }

    if (!checkCancelled()) {
      setPages(pagesData.map(p => p.page.outerHTML));
    }
    
    document.body.removeChild(temp);
  };

  return (
    <div id="premium-export-container" className="flex flex-col gap-8 items-center origin-top w-full">
      {pages.map((pageHtml, index) => (
        <div 
          key={index}
          className="export-page bg-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-slate-800/20 shrink-0 relative overflow-hidden"
          style={{ width: '794px', height: '1122px' }}
          dangerouslySetInnerHTML={{ __html: pageHtml }}
        />
      ))}
    </div>
  );
}