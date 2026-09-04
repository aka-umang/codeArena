import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { fetchProblems } from '../problemSlice';

function Homepage() {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    problems,
    currentPage,
    totalPages,
    loading
  } = useSelector((state) => state.problem);

  const [page, setPage] = useState(1);

  const [solvedProblems, setSolvedProblems] = useState([]);

  const [currentStreak, setCurrentStreak] = useState(0);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });


  // ==========================================
  // FETCH PROBLEMS
  // ==========================================

  useEffect(() => {

    dispatch(
      fetchProblems({
        page,
        limit: 10,
        difficulty: filters.difficulty,
        tags: filters.tag
      })
    );

  }, [
    dispatch,
    page,
    filters.difficulty,
    filters.tag
  ]);


  // ==========================================
  // FETCH SOLVED PROBLEMS
  // ==========================================

  useEffect(() => {

    const fetchSolvedProblems = async () => {

      try {

        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );

        setSolvedProblems(data);

      } catch (error) {

        console.error(
          "Error fetching solved problems:",
          error
        );

      }

    };

    if (user) {
      fetchSolvedProblems();
    } else {
      setSolvedProblems([]);
    }

  }, [user]);


  // ==========================================
  // FETCH CURRENT STREAK (for navbar icon)
  // ==========================================

  useEffect(() => {

    const fetchStreak = async () => {

      try {

        const { data } = await axiosClient.get("/dashboard/streak");

        setCurrentStreak(data.currentStreak || 0);

      } catch (error) {

        console.error(
          "Error fetching streak:",
          error
        );

      }

    };

    if (user) {
      fetchStreak();
    } else {
      setCurrentStreak(0);
    }

  }, [user]);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    dispatch(logoutUser());

    setSolvedProblems([]);

  };


  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (filterName, value) => {

    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));

    // Whenever a filter changes,
    // go back to first page.
    setPage(1);

  };


  // ==========================================
  // STATUS FILTER
  // ==========================================
  //
  // Difficulty and topic are handled by backend.
  // Status is handled here using solvedProblems.
  //
  // ==========================================

  const displayedProblems =
    filters.status === 'all'
      ? problems
      : problems.filter((problem) =>
        solvedProblems.some(
          (solvedProblem) =>
            solvedProblem._id === problem._id
        )
      );


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="min-h-screen flex justify-center items-center">

        <span className="loading loading-spinner loading-lg"></span>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-base-100">


      {/* ======================================
          NAVIGATION BAR
      ====================================== */}

      <nav className="navbar bg-base-200 border-b border-base-300 shadow-lg px-4">

        <div className="flex-1">

          <NavLink
            to="/"
            className="btn btn-ghost text-xl font-display font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CODEARENA
            </span>
          </NavLink>

        </div>


        <div className="flex-none flex items-center gap-2">

          {user && (

            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                currentStreak > 0
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                  : "border-base-300 bg-base-300/40 text-base-content/50"
              }`}
              title={
                currentStreak > 0
                  ? `${currentStreak} day streak — keep it going!`
                  : "No active streak yet — solve a problem today to start one"
              }
            >
              <span>🔥</span>
              <span className="font-mono font-semibold text-sm">{currentStreak}</span>
            </div>

          )}

          <div className="dropdown dropdown-end">

            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle p-0"
            >

              <div className="avatar placeholder">

                <div className="bg-primary text-primary-content rounded-full w-10">

                  <span className="font-semibold text-lg">

                    {user?.firstName
                      ?.charAt(0)
                      .toUpperCase()
                    }

                  </span>

                </div>

              </div>

            </button>


            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-64 border border-base-300"
            >

              <li className="menu-title">

                <div className="flex flex-col items-start">

                  <span className="text-base font-bold">
                    {user?.firstName}
                  </span>

                  <span className="text-xs text-base-content/60">
                    {user?.emailId}
                  </span>


                  {user?.isPremium ? (

                    <span className="badge badge-warning mt-2">
                      👑 Premium
                    </span>

                  ) : (

                    <span className="badge badge-neutral mt-2">
                      Free Member
                    </span>

                  )}

                </div>

              </li>


              <div className="divider my-1"></div>

              <li>
                <NavLink to="/dashboard">
                  📊 Dashboard
                </NavLink>
              </li>

              {user?.role === "admin" && (

                <li>

                  <NavLink to="/admin">
                    🛠 Admin Panel
                  </NavLink>

                </li>

              )}


              <li>

                <button onClick={handleLogout}>
                  🚪 Logout
                </button>

              </li>

            </ul>

          </div>

        </div>

      </nav>



      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="container mx-auto p-4">


        {/* ====================================
            FILTERS
        ==================================== */}

        <div className="flex flex-wrap gap-4 mb-6">


          {/* STATUS FILTER */}

          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) =>
              handleFilterChange(
                'status',
                e.target.value
              )
            }
          >

            <option value="all">
              All Problems
            </option>

            <option value="solved">
              Solved Problems
            </option>

          </select>



          {/* DIFFICULTY FILTER */}

          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              handleFilterChange(
                'difficulty',
                e.target.value
              )
            }
          >

            <option value="all">
              All Difficulties
            </option>

            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>

          </select>



          {/* TOPIC FILTER */}

          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) =>
              handleFilterChange(
                'tag',
                e.target.value
              )
            }
          >

            <option value="all">
              All Topics
            </option>

            <option value="array">
              Array
            </option>

            <option value="string">
              String
            </option>

            <option value="linkedList">
              Linked List
            </option>

            <option value="stack">
              Stack
            </option>

            <option value="queue">
              Queue
            </option>

            <option value="graph">
              Graph
            </option>

            <option value="tree">
              Tree
            </option>

            <option value="sorting">
              Sorting
            </option>

            <option value="binarySearch">
              Binary Search
            </option>

            <option value="hashing">
              Hashing
            </option>

            <option value="dynamicProgramming">
              Dynamic Programming
            </option>

            <option value="greedy">
              Greedy
            </option>

            <option value="heap">
              Heap
            </option>

            <option value="backtracking">
              Backtracking
            </option>

            <option value="bitManipulation">
              Bit Manipulation
            </option>

            <option value="matrix">
              Matrix
            </option>

            <option value="math">
              Math
            </option>

          </select>

        </div>



        {/* ====================================
            PROBLEMS LIST
        ==================================== */}

        <div className="grid gap-4">

          {displayedProblems.length === 0 ? (

            <div className="card bg-base-200 border border-base-300 shadow-xl">

              <div className="card-body text-center">

                <h2 className="text-xl font-semibold">
                  No problems found
                </h2>

                <p className="text-base-content/60">
                  Try changing your filters.
                </p>

              </div>

            </div>

          ) : (

            displayedProblems.map((problem) => (

              <div
                key={problem._id}
                className="card bg-base-200 border border-base-300 shadow-xl hover:border-primary/40 transition-colors"
              >

                <div className="card-body">


                  {/* TITLE + SOLVED */}

                  <div className="flex items-center justify-between">

                    <h2 className="card-title">

                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="hover:text-primary"
                      >
                        {problem.title}
                      </NavLink>

                    </h2>


                    {solvedProblems.some(
                      (sp) => sp._id === problem._id
                    ) && (

                        <div className="badge badge-success gap-2">

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >

                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />

                          </svg>

                          Solved

                        </div>

                      )}

                  </div>



                  {/* DIFFICULTY + TAG */}

                  <div className="flex gap-2">

                    <div
                      className={`badge ${getDifficultyBadgeColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </div>


                    <div className="badge badge-info">
                      {problem.tags}
                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>



        {/* ====================================
            PAGINATION
        ==================================== */}

        {totalPages > 0 && (

          <div className="flex justify-center items-center gap-4 mt-8">


            {/* PREVIOUS */}

            <button
              className="btn"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
            >
              Previous
            </button>


            {/* PAGE NUMBER */}

            <span className="font-semibold">

              Page {currentPage} of {totalPages}

            </span>


            {/* NEXT */}

            <button
              className="btn"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
            >
              Next
            </button>

          </div>

        )}

      </div>

    </div>

  );
}


// ==========================================
// DIFFICULTY BADGE COLOR
// ==========================================

const getDifficultyBadgeColor = (difficulty) => {

  switch (difficulty.toLowerCase()) {

    case 'easy':
      return 'badge-success';

    case 'medium':
      return 'badge-warning';

    case 'hard':
      return 'badge-error';

    default:
      return 'badge-neutral';

  }

};


export default Homepage;