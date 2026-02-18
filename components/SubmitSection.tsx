'use client';

interface Props {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
    generatedPatientId: string;
    onSubmit: () => void;
    onDownloadPDF: () => void;
}

/**
 * SubmitSection — Submit button, status messages, and PDF download
 */
export default function SubmitSection({
    status,
    message,
    generatedPatientId,
    onSubmit,
    onDownloadPDF,
}: Props) {
    return (
        <section className="bg-white border border-[#D1D5DB] p-5 mb-4">
            {/* Submit Button */}
            <div className="text-center py-2">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={status === 'submitting'}
                    className={`inline-block px-10 py-2.5 text-[13px] font-medium uppercase tracking-wide text-white rounded-[4px] border ${status === 'submitting'
                            ? 'bg-[#9CA3AF] border-[#9CA3AF] cursor-not-allowed'
                            : 'bg-[#1E3A8A] border-[#1E3A8A] hover:bg-[#1a3278] cursor-pointer'
                        }`}
                >
                    {status === 'submitting' ? 'Submitting...' : status === 'success' ? 'Submitted' : 'Submit Assessment'}
                </button>
            </div>

            {/* Status Message */}
            {message && (
                <div
                    className={`text-center p-3 text-[13px] font-medium mt-3 border ${status === 'success'
                            ? 'text-[#065F46] border-[#065F46] bg-[#ECFDF5]'
                            : status === 'error'
                                ? 'text-[#B91C1C] border-[#B91C1C] bg-[#FEF2F2]'
                                : 'text-[#374151] border-[#D1D5DB] bg-[#F9FAFB]'
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Generated Patient ID */}
            {generatedPatientId && (
                <div className="text-center p-2.5 text-[13px] font-medium text-[#1E3A8A] mt-2 border border-[#D1D5DB] bg-[#F9FAFB]">
                    Generated Patient ID: {generatedPatientId}
                </div>
            )}

            {/* PDF Download Button */}
            {status === 'success' && (
                <div className="text-center pt-3">
                    <button
                        type="button"
                        onClick={onDownloadPDF}
                        className="inline-block px-10 py-2.5 text-[13px] font-medium uppercase tracking-wide text-[#1E3A8A] bg-white border border-[#1E3A8A] rounded-[4px] hover:bg-[#F3F4F6] cursor-pointer"
                    >
                        Download Assessment PDF
                    </button>
                </div>
            )}
        </section>
    );
}
