import { Outlet } from "react-router";

export default function Page() {
	return <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
		<div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">My Polls</p></div>
		<div className="px-4 py-3 @container">
			<div className="flex overflow-hidden rounded-xl border border-[#42513e] bg-[#131712]">
				<table className="flex-1">
					<thead>
						<tr className="bg-[#1f251d]">
							<th className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-120 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Poll</th>
							<th className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-240 px-4 py-3 text-left text-white w-60 text-sm font-medium leading-normal">Status</th>
							<th className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-360 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Responses</th>
							<th className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-480 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Ends</th>
							<th className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-600 px-4 py-3 text-left text-white w-60 text-[#a5b6a0] text-sm font-medium leading-normal">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-t border-t-[#42513e]">
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
								What's your favorite ice cream flavor?
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-240 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
								<button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2d372a] text-white text-sm font-medium leading-normal w-full">
									<span className="truncate">Closed</span>
								</button>
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-360 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">123</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-480 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">
								2023-08-15
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-600 h-[72px] px-4 py-2 w-60 text-[#a5b6a0] text-sm font-bold leading-normal tracking-[0.015em]">
								Duplicate, Delete
							</td>
						</tr>
						<tr className="border-t border-t-[#42513e]">
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
								Which movie genre do you prefer?
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-240 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
								<button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2d372a] text-white text-sm font-medium leading-normal w-full">
									<span className="truncate">Open</span>
								</button>
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-360 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">456</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-480 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">
								2023-09-20
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-600 h-[72px] px-4 py-2 w-60 text-[#a5b6a0] text-sm font-bold leading-normal tracking-[0.015em]">
								Duplicate, Delete
							</td>
						</tr>
						<tr className="border-t border-t-[#42513e]">
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
								What's your preferred travel destination?
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-240 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
								<button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#2d372a] text-white text-sm font-medium leading-normal w-full">
									<span className="truncate">Closed</span>
								</button>
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-360 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">789</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-480 h-[72px] px-4 py-2 w-[400px] text-[#a5b6a0] text-sm font-normal leading-normal">
								2023-07-10
							</td>
							<td className="table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-600 h-[72px] px-4 py-2 w-60 text-[#a5b6a0] text-sm font-bold leading-normal tracking-[0.015em]">
								Duplicate, Delete
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<style>{`
                          @container(max-width:120px){.table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-120{display: none;}}
                @container(max-width:240px){.table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-240{display: none;}}
                @container(max-width:360px){.table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-360{display: none;}}
                @container(max-width:480px){.table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-480{display: none;}}
                @container(max-width:600px){.table-1163f8e9-f1c9-445c-95ac-b6ae291a88a1-column-600{display: none;}}
              `}</style>
							<Outlet />
		</div>
	</div>
}