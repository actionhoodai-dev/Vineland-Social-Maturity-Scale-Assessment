'use client';

interface Props {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
    onSubmit: () => void;
    onDownloadPDF: () => void;
}

/**
 * SubmitSection — High-contrast professional submission controls
 */
export default function SubmitSection({
    status,
    message,
    onSubmit,
    onDownloadPDF,
}: Props) {
    return (
        <section className="bg-white border border-[#D1D5DB] p-8 mb-4">
            {/* Status Message */}
            {message && (
                <div
                    className={`text-center p-4 text-[13px] font-bold mb-6 border uppercase tracking-widest ${status === 'success'
                            ? 'text-black border-black bg-[#F9FAFB]'
                            : status === 'error'
                                ? 'text-white border-black bg-black'
                                : 'text-black border-[#D1D5DB] bg-[#F9FAFB]'
                        }`}
                >
                    {status === 'success' && '✅ '}
                    {message}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* Submit Button */}
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={status === 'submitting'}
                    className={`px-12 py-4 text-[13px] font-bold uppercase tracking-[0.2em] transition-all border ${status === 'submitting'
                            ? 'bg-[#9CA3AF] border-[#9CA3AF] text-white cursor-not-allowed'
                            : 'bg-black border-black text-white hover:bg-[#333] cursor-pointer'
                        }`}
                >
                    {status === 'submitting' ? 'EXECUTING SUBMISSION...' : 'AUTHORIZE & SUBMIT ASSESSMENT'}
                </button>

                {/* PDF Download Button */}
                {status === 'success' && (
                    <button
                        type="button"
                        onClick={onDownloadPDF}
                        className="px-12 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-black bg-white border border-black hover:bg-black hover:text-white transition-all cursor-pointer"
                    >
                        DOWNLOAD ASSESSMENT PDF
                    </button>
                )}
            </div>

            <p className="text-center mt-6 text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">
                VERIFY ALL RECORDS BEFORE AUTHORIZING FINAL CLINICAL SUBMISSION
            </p>
        </section>
    );
}
