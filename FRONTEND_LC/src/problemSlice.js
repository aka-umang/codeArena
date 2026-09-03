// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axiosClient from "./utils/axiosClient";

// export const fetchProblems = createAsyncThunk(
//     "problem/getAllProblem",
//     async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
//         try {
//             const { data } = await axiosClient.get(
//                 `/problem/getAllProblem?page=${page}&limit=${limit}`
//             );

//             return data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || err.message);
//         }
//     }
// );

// const problemSlice = createSlice({
//     name: "problem",

//     initialState: {
//         problems: [],
//         currentPage: 1,
//         totalPages: 1,
//         totalProblems: 0,
//         limit: 10,
//         loading: false,
//         error: null
//     },

//     reducers: {},

//     extraReducers: (builder) => {
//         builder

//             .addCase(fetchProblems.pending, (state) => {
//                 state.loading = true;
//             })

//             .addCase(fetchProblems.fulfilled, (state, action) => {
//                 state.loading = false;

//                 state.problems = action.payload.problems;
//                 state.currentPage = action.payload.currentPage;
//                 state.totalPages = action.payload.totalPages;
//                 state.totalProblems = action.payload.totalProblems;
//                 state.limit = action.payload.limit;
//             })

//             .addCase(fetchProblems.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     }
// });


// export default problemSlice.reducer;






import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const fetchProblems = createAsyncThunk(
    "problem/getAllProblem",

    async (
        {
            page = 1,
            limit = 10,
            difficulty = "all",
            tags = "all",
            status = "all"
        },
        { rejectWithValue }
    ) => {
        try {

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", limit);

            if (difficulty !== "all") {
                params.append("difficulty", difficulty);
            }

            if (tags !== "all") {
                params.append("tags", tags);
            }

            if (status !== "all") {
                params.append("status", status);
            }

            const { data } = await axiosClient.get(
                `/problem/getAllProblem?${params.toString()}`
            );

            return data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

const problemSlice = createSlice({
    name: "problem",

    initialState: {
        problems: [],
        currentPage: 1,
        totalPages: 1,
        totalProblems: 0,
        limit: 10,
        loading: false,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(fetchProblems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProblems.fulfilled, (state, action) => {

                state.loading = false;

                state.problems = action.payload.problems;

                state.currentPage = action.payload.currentPage;

                state.totalPages = action.payload.totalPages;

                state.totalProblems = action.payload.totalProblems;

                state.limit = action.payload.limit;
            })

            .addCase(fetchProblems.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;
            });
    }
});

export default problemSlice.reducer;