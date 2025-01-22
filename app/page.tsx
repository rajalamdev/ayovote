"use client"
// import { useSession, signIn, signOut } from "next-auth/react"

import Image from "next/image";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import { LinkIcon, TrashIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useVotes } from "./lib/useVotes";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from "moment";
import RestrictedPage from "./components/page/RestrictedPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function Home() {
  // extracting data from usesession as session
  const { data: session } = useSession()
  
  const { data: votesApi , isLoading: votesApiLoading } = useVotes();
  const [votes, setVotes] = useState<Vote[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredVotes, setFilteredVotes] = useState<Vote[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (votesApi){
      setVotes(votesApi)
    }
  }, [votesApi])

  useEffect(() => {
    if (votes) {
      const filtered = votes.filter(vote => 
        vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVotes(filtered);
      setCurrentPage(1); // Reset to first page when searching
    }
  }, [searchTerm, votes]);

  const paginatedVotes = filteredVotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVotes.length / itemsPerPage);

  const csvData = filteredVotes.map(vote => ({
    Judul: vote.title,
    Kode: vote.code,
    'Tanggal Mulai': moment(vote.startDateTime).format('DD MMMM YYYY, h:mm:ss a'),
    'Tanggal Selesai': moment(vote.endDateTime).format('DD MMMM YYYY, h:mm:ss a'),
    Kandidat: vote.candidates.map(c => c.name).join(' vs '),
  }));

  function deleteHandler(code: string) {
    const confirmDelete = () => toast.promise(
      fetch(`/api/votes/${code}`, { method: "DELETE" })
        .then(res => {
          if (res.ok) {
            setVotes(votes?.filter((vote) => vote.code !== code));
            return "Data berhasil dihapus";
          }
          throw new Error("Failed to delete");
        }),
      {
        pending: 'Menghapus data...',
        success: 'Data berhasil dihapus 👌',
        error: 'Data gagal dihapus 🤯'
      }
    );

    toast.info(
      <div className="flex flex-col items-center">
        <p className="text-center font-medium mb-4">Apakah anda yakin ingin menghapus data tersebut?</p>
        <div className="flex gap-3">
          <button 
            onClick={confirmDelete} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Ya
          </button>
          <button 
            onClick={() => toast.dismiss()} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Tidak
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: true,
      }
    );
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Daftar Voting', 14, 15);
    doc.setFontSize(10);
    doc.text(`Diekspor pada: ${moment().format('DD MMMM YYYY, HH:mm')}`, 14, 22);

    // Create table
    autoTable(doc, {
      head: [['No', 'Judul', 'Kandidat', 'Kode', 'Mulai', 'Selesai']],
      body: filteredVotes.map((vote, index) => [
        index + 1,
        vote.title,
        vote.candidates.map(c => c.name).join(' vs '),
        vote.code,
        moment(vote.startDateTime).format('DD/MM/YY HH:mm'),
        moment(vote.endDateTime).format('DD/MM/YY HH:mm'),
      ]),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.save('voting-data.pdf');
  };

  const exportSingleVotePDF = (vote: Vote) => {
    const doc = new jsPDF();
    
    // Calculate status
    const now = new Date();
    const startDate = new Date(vote.startDateTime);
    const endDate = new Date(vote.endDateTime);
    
    let status = "Belum Dimulai";
    if (now > endDate) {
      status = "Sudah Selesai";
    } else if (now >= startDate && now <= endDate) {
      status = "Sedang Berlangsung";
    }
    
    // Add title and metadata
    doc.setFontSize(16);
    doc.text(`Hasil Voting: ${vote.title}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Diekspor pada: ${moment().format('DD MMMM YYYY, HH:mm')}`, 14, 22);
    doc.text(`Status: ${status}`, 14, 27);
    doc.text(`Dimulai pada: ${moment(vote.startDateTime).format('DD MMMM YYYY, HH:mm')}`, 14, 32);
    doc.text(`Diakhiri pada: ${moment(vote.endDateTime).format('DD MMMM YYYY, HH:mm')}`, 14, 37);

    // Create table
    autoTable(doc, {
      head: [['No', 'Kandidat', 'Jumlah Suara']],
      body: vote.candidates.map((candidate, index) => [
        index + 1,
        candidate.name,
        // Add vote count logic here if available
        '0' // Placeholder for vote count
      ]),
      startY: 42, // Adjusted startY to accommodate the new header information
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.save(`voting-${vote.code}.pdf`);
  };

  const getSingleVoteCSV = (vote: Vote) => {
    const now = new Date();
    const startDate = new Date(vote.startDateTime);
    const endDate = new Date(vote.endDateTime);
    
    let status = "Belum Dimulai";
    if (now > endDate) {
      status = "Sudah Selesai";
    } else if (now >= startDate && now <= endDate) {
      status = "Sedang Berlangsung";
    }

    return [{
      Judul: vote.title,
      Kode: vote.code,
      Status: status,
      'Tanggal Mulai': moment(vote.startDateTime).format('DD MMMM YYYY, h:mm:ss a'),
      'Tanggal Selesai': moment(vote.endDateTime).format('DD MMMM YYYY, h:mm:ss a'),
      Kandidat: vote.candidates.map(c => c.name).join(' vs '),
    }];
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="flex flex-col gap-4 max-w-md mx-auto items-center pt-12 pb-20">
          <h1 className="text-4xl font-bold text-center">Ayo Mulai Voting</h1>
          <p className="bg-zinc-100 font-medium py-2 px-4 text-center">Web Voting No.1 Di Indonesia</p>
          <Image src={"/hero.png"} width={150} height={150} alt="Hero Image" />
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-20">
            <Link 
              href={"/vote/create"}
              className="bg-black text-white rounded-sm text-sm font-medium py-2 px-4 text-center"
            >
              Buat Vote Baru
            </Link>
            <Link 
              href={"/participant"} 
              className="bg-transparent border-2 border-black text-black rounded-sm text-sm font-medium py-2 px-4 text-center"
            >
              Ikutan Vote
            </Link>
          </div>
        </section>
        {/* {votesApiLoading && !session && (
          <>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse"></div>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse mt-2"></div>
            <div className="bg-[#999] w-full h-12 rounded animate-pulse mt-2"></div>
          </>
        )} */}
        {session && (
          <section className="w-full container">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <h2 className="font-semibold">Vote yang saya buat</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari vote..."
                    className="pl-10 pr-4 py-2 border rounded-md w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kandidat</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Mulai</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Selesai</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedVotes.map((vote: Vote, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                      <td className="px-4 py-4 text-sm">{vote.title}</td>
                      <td className="px-4 py-4 text-sm">
                        {vote.candidates.map((candidate, idx) => (
                          candidate.name + (idx + 1 !== vote.candidates.length ? " vs " : "")
                        ))}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Link href={`participant/${vote.code}`} className="font-bold text-blue-400 underline hover:text-blue-500">
                          {vote.code}
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                        {moment(vote.startDateTime).format('DD/MM/YY HH:mm')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                        {moment(vote.endDateTime).format('DD/MM/YY HH:mm')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-3">
                          <Link href={`/vote/${vote.code}`}>
                            <LinkIcon className="w-5" />
                          </Link>
                          <button onClick={() => exportSingleVotePDF(vote)} className="text-red-500 hover:text-red-600">
                            <DocumentArrowDownIcon className="w-5" />
                          </button>
                          <CSVLink 
                            data={getSingleVoteCSV(vote)}
                            filename={`voting-${vote.code}.csv`}
                            className="text-green-600 hover:text-green-700"
                          >
                            <ArrowDownTrayIcon className="w-5" />
                          </CSVLink>
                          <button onClick={() => deleteHandler(vote.code)} className="text-gray-600 hover:text-gray-800">
                            <TrashIcon className="w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!filteredVotes.length && (
                <div className="text-center py-8 bg-gray-50">
                  <p className="text-gray-500">Tidak ada vote yang ditemukan!</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredVotes.length > itemsPerPage && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <ToastContainer />
    </>
  );
}
