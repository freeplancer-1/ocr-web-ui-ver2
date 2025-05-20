import { PhotoIcon} from "@heroicons/react/24/outline";
import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImages } from "../apis/upload";

function UploadPage() {
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleFiles = (selected) => {
		const arr = Array.from(selected).filter((file) => file.type.startsWith("image/"));
		setFiles((prev) => [...prev, ...arr]);
	};

	const handleFileChange = (e) => {
		if (e.target.files) handleFiles(e.target.files);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
		if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
		e.dataTransfer.clearData();
	};


	const handleClick = async (e) => {
		e.preventDefault();
		if (files.length === 0) return;
		setLoading(true);

		try {
			const baseUrl = import.meta.env.VITE_API_BASE_URL;
			const uploadUrl = `${baseUrl}/api/upload-image`;

			const results = await uploadImages(files, {
				url: uploadUrl,
				onUploadProgress: (evt) => {

				},
			})

			sessionStorage.setItem("invoice_data", JSON.stringify(results));

			navigate("/invoice-detail");
		} catch (err) {
			console.error("Upload failed:", err);
		} finally {
			setLoading(false);
		}
	};


	return (
		<div className="min-h-screen w-[100dvw] flex flex-col items-center justify-center p-[2dvh]">
			<h2 className="text-4xl font-bold text-center mt-[2dvh]">
				Scanning Invoice
			</h2>

			<div
				className="w-[90dvw] h-[60dvh] border-2 border-dashed border-gray-300 rounded-lg mt-[4dvh] flex flex-wrap items-center justify-center relative p-4"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				onClick={() => inputRef.current?.click()}
			>
				{files.length > 0 ? (
					files.map((file, idx) => {
						const url = URL.createObjectURL(file);
						return (
							<div
								key={idx}
								className="relative w-40 h-40 m-2 border rounded overflow-hidden"
							>
								<img
									src={url}
									alt={`preview-${idx}`}
									className="w-full h-full object-contain"
								/>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setFiles((prev) => prev.filter((_, i) => i !== idx));
									}}
									className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 text-red-500 hover:bg-opacity-100"
								>
									✕
								</button>
							</div>
						);
					})
				) : (
					<div className="text-center">
						<PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p className="text-lg font-medium">Drop or Browse Images</p>
						<p className="text-sm text-gray-400 mt-1">
							Supported: JPG, PNG, PDF
						</p>
					</div>
				)}

				<input
					ref={inputRef}
					type="file"
					multiple
					accept="image/*,.pdf"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>

			<button
				onClick={handleClick}
				disabled={files.length === 0 || loading}
				className={`mt-[4dvh] px-6 py-2 rounded-md text-white bg-blue-600`}>
				{loading
					? "Uploading..."
					: `Scan Invoice (${files.length})`}
			</button>

			{loading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
					<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
						<div className="h-12 w-12 mb-4 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
						<p className="text-gray-700 font-medium">Loading...</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default UploadPage;
