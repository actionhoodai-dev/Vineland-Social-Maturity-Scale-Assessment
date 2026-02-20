'use client';

interface Props {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
    onSubmit: () => void;
    onDownloadPDF: () => void;
}

/**
 * SubmitSection — High-contrast Navy professional submission controls
 */
export default function SubmitSection({
    status,
    message,
    onSubmit,
    onDownloadPDF,
}: Props) {
    return (
        <section className="bg-white border border-[#D1D5DB] p-6 md:p-10 mb-8 shadow-md">
            {/* Status Message */}
            {message && (
                <div
                    className={`text-center p-4 text-[12px] md:text-[13px] font-bold mb-8 border-2 uppercase tracking-widest ${status === 'success'
                            ? 'text-white border-[#065F46] bg-[#065F46]'
                            : status === 'error'
                                ? 'text-white border-[#B91C1C] bg-[#B91C1C]'
                                : 'text-white border-[#1E3A8A] bg-[#1E3A8A]'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {status === 'success' && <span>✅</span>}
                        {status === 'error' && <span>⚠️</span>}
                        <span>{message}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4">
                {/* Submit Button */}
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={status === 'submitting'}
                    className={`flex-1 md:flex-none px-12 py-5 text-[12px] font-bold uppercase tracking-[0.2em] transition-all border-2 ${status === 'submitting'
                            ? 'bg-[#9CA3AF] border-[#9CA3AF] text-white cursor-not-allowed'
                            : 'bg-[#1E3A8A] border-[#1E3A8A] text-white hover:bg-[#1a3278] cursor-pointer shadow-lg active:translate-y-0.5'
                        }`}
                >
                    {status === 'submitting' ? 'PROCESSING DATA...' : 'Finalize & Record Assessment'}
                </button>

                {/* PDF Download Button */}
                {status === 'success' && (
                    <button
                        type="button"
                        onClick={onDownloadPDF}
                        className="flex-1 md:flex-none px-12 py-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#1E3A8A] bg-white border-2 border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all cursor-pointer shadow-lg active:translate-y-0.5"
                    >
                        Download PDF Report
                    </button>
                )}
            </div>

            <p className="text-center mt-8 text-[9px] text-[#6B7280] font-bold uppercase tracking-[0.2em] opacity-80">
                I hereby authorize the submission of this clinical evaluation to the institutional database.
            </p>
        </section>
    );
}
