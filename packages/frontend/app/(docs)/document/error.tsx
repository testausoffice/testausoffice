'use client';
import { buttonVariants } from '@/components/ui/button';
import { NotFoundError } from '@/lib/exceptions';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      {error instanceof NotFoundError ? (
        <>
          <head>
            <style>{`
              .text-11xl {
                font-size: 14rem;
                line-height: 10rem;
              }
              @media (max-width: 645px) {
                .text-11xl {
                  font-size: 9rem;
                  line-height: 7rem;
                }
                .text-6xl {
                  font-size: 1.75rem;
                }
                .text-2xl {
                  font-size: 1rem;
                  line-height: 1.2rem;
                }
                .py-8 {
                  padding-top: 1rem;
                  padding-bottom: 1rem;
                }
                .px-6 {
                  padding-left: 1.2rem;
                  padding-right: 1.2rem;
                }
                .mr-6 {
                  margin-right: 0.5rem;
                }
                .px-12 {
                  padding-left: 1rem;
                  padding-right: 1rem;
                }
              }
            `}</style>
          </head>
          <div className="bg-background">
            <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
              <div className="bg-neutral-900 shadow overflow-hidden sm:rounded-lg pb-8">
                <div className=" text-center pt-8">
                  <h1 className="text-11xl font-black text-[#E9ECEF]">404</h1>
                  <h1 className="text-6xl font-bold py-6 text-[#c1c2c5]">Document not found</h1>
                  <p className="text-2xl pb-6 px-12 font-semibold text-[#c1c2c5]">
                    Unfortunately, the document you requested was not found. You may have mistyped the address, or you may not have access to the document.
                  </p>
                  <a href="/" className={`${buttonVariants({ variant: 'default' })} text-[#121212] text-base`}>
                    Take me back
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <div>Unknown Error</div>
          <h1>Something went wrong</h1>
          <p>Unfortunately, the document you requested was not found. You may have mistyped the address, or you may not have access to the document.</p>
          <div>
            <a href="/" className={buttonVariants({ variant: 'default' })}>
              Take me back
            </a>
          </div>
        </div>
      )}
    </>
  );
}
