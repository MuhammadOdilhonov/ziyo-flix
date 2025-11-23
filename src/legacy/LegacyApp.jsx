'use client'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"

// Pages & Components (copied from legacy index.js)
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Profile from "./pages/profile/Profile"
import RequireAuth from "./pages/RequireAuth"
import Reels from "./components/reels/Reels"
import Tutorials from "./components/tutorials/Tutorials"
import Movies from "./components/movies/Movies"
import MovieDetail from "./components/movies/MovieDetail"
import WatchPage from "./pages/watch/WatchPage"
import Channels from "./components/channels/Channels"
import ChannelDetail from "./components/channels/ChannelDetail"
import Search from "./components/Search/Search"
import Register from "./pages/register/Register"
import TutorialDetail from "./components/tutorials/TutorialDetail"
import MovieCategory from "./components/movies/MovieCategory"
import TutorialCategory from "./components/tutorials/TutorialCategory"
import VideoPlayer from "./components/tutorials/VideoPlayer"
import TestPage from "./components/tutorials/TestPage"
import AssignmentUpload from "./components/tutorials/AssignmentUpload"
import DirectorDashboard from "./components/director/Dashboard"
import DirectorUsers from "./components/director/DirectorUsers"
import DirectorTeachers from "./components/director/DirectorTeachers"
import DirectorAdmins from "./components/director/DirectorAdmins"
import DirectorReports from "./components/director/DirectorReports"
import ContentReview from "./components/director/ContentReview"
import SiteManagement from "./components/director/SiteManagement"
import CategoryMovies from "./components/director/CategoryMovies"
import MovieFiles from "./components/director/MovieFiles"
import PromoCodesManagement from "./components/director/PromoCodesManagement"
import DirectorChannels from "./components/director/DirectorChannels"
import AdminVideos from "./components/admin/Videos"
import DirectorReels from "./components/director/DirectorReels"
import TeacherVideos from "./components/teacher/Videos"
import VideoUpload from "./components/teacher/VideoUpload"
import AssignmentCreator from "./components/teacher/AssignmentCreator"
import TeacherAssignments from "./components/teacher/Assignments"
import AssignmentGrader from "./components/teacher/AssignmentGrader"
import TeacherTests from "./components/teacher/TeacherTests"
import TeacherAssignmentsManagement from "./components/teacher/TeacherAssignmentsManagement"
import AssignmentReview from "./components/teacher/AssignmentReview"
import TestCreator from "./components/teacher/TestCreator"
import UserCourses from "./components/user/UserCourses"
import UserSaved from "./components/user/UserSaved"
import UserSavedReels from "./components/user/UserSavedReels"
import UserSubmittedAssignments from "./components/user/UserSubmittedAssignments"
import UserTestResults from "./components/user/UserTestResults"
import UserLiked from "./components/user/Liked"
import UserLikesComments from "./components/user/UserLikesComments"
import UserCertificates from "./components/user/Certificates"
import UserWallet from "./components/user/Wallet"
import TeacherInfomration from "./components/teacher/TeacherInfomration"
import CategoryDetail from "./components/teacher/CategoryDetail"
// import TeacherChannel from "./components/teacher/Channel" // not routed directly in index
import TeacherWallet from "./components/teacher/TeacherWallet"
import Settings from "./components/common/Settings"
import WalletSystem from "./components/user/WalletSystem"
import RequireTeacherChannel from "./pages/RequireTeacherChannel"
import ChannelSelector from "./components/teacher/ChannelSelector"
import ChannelEditor from "./components/teacher/ChannelEditor"
import TeacherDashboard from "./components/teacher/TeacherDashboard"
import TeacherAnalytics from "./components/teacher/TeacherAnalytics"
import TeacherReels from "./components/teacher/TeacherReels"
import TeacherUploadReels from "./components/teacher/TeacherUploadReels"
import CourseTypeTest from "./components/tutorials/CourseTypeTest"
import CourseTypeAssignment from "./components/tutorials/CourseTypeAssignment"
import TeacherStudents from "./components/teacher/TeacherStudents"
import Sukunat from './components/meditation/Sukunat'
import SukunatId from './components/meditation/SukunatId'
import TeacherClassrooms from "./components/teacher/TeacherClassrooms"
import TeacherClassroomDashboard from "./components/teacher/TeacherClassroomDashboard"
import StudentClassrooms from "./components/user/StudentClassrooms"
import StudentClassroomDashboard from "./components/user/StudentClassroomDashboard"

export default function LegacyApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<App />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/reels" element={<Reels />} />
                    <Route path="/reels/:reelSlug" element={<Reels />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/tutorials/category/:categorySlug" element={<TutorialCategory />} />
                    <Route path="/tutorials/:tutorialSlug" element={<TutorialDetail />} />
                    <Route path="/tutorials/:tutorialSlug/video/:lessonId" element={<RequireAuth><VideoPlayer /></RequireAuth>} />
                    <Route path="/tutorials/:tutorialSlug/month/:courseTypeId/test" element={<RequireAuth><CourseTypeTest /></RequireAuth>} />
                    <Route path="/tutorials/:tutorialSlug/month/:courseTypeId/assignment" element={<RequireAuth><CourseTypeAssignment /></RequireAuth>} />
                    <Route path="/tutorials/:tutorialSlug/test/:lessonId" element={<RequireAuth><TestPage /></RequireAuth>} />
                    <Route path="/tutorials/:tutorialSlug/assignment/:lessonId" element={<RequireAuth><AssignmentUpload /></RequireAuth>} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movies/category/:categoryName" element={<MovieCategory />} />
                    <Route path="/movies/:movieSlug" element={<MovieDetail />} />
                    <Route path="/channels" element={<Channels />} />
                    <Route path="/channels/:username" element={<ChannelDetail />} />
                    <Route path="/search" element={<Search />} />
                    {/* Teacher Student Classroom Routes */}
                    <Route path="/teacher/classrooms" element={<TeacherClassrooms />} />
                    <Route path="/user/classrooms" element={<StudentClassrooms />} />

                    <Route path="/timers" element={<Sukunat />} />
                </Route>

                {/* Classroom Routes Teacher and Student */}
                <Route path="/teacher/classroom/:classroomId/*" element={<TeacherClassroomDashboard />} />
                <Route path="/user/classroom/:classroomId/*" element={<StudentClassroomDashboard />} />

                <Route path="/timers/:id" element={<SukunatId />} />
                <Route path="/profile/" element={<RequireAuth><Profile /></RequireAuth>}>
                    {/* Director Routes */}
                    <Route path="director/dashboard" element={<DirectorDashboard />} />
                    <Route path="director/users" element={<DirectorUsers />} />
                    <Route path="director/teachers" element={<DirectorTeachers />} />
                    <Route path="director/admins" element={<DirectorAdmins />} />
                    <Route path="director/channels" element={<DirectorChannels />} />
                    <Route path="director/content-review" element={<ContentReview />} />
                    <Route path="director/reels" element={<DirectorReels />} />
                    <Route path="director/wallets" element={<h2>Hamyonlar</h2>} />
                    <Route path="director/promocodes" element={<PromoCodesManagement />} />
                    <Route path="director/site-management" element={<SiteManagement />} />
                    <Route path="director/category-movies/:slug" element={<CategoryMovies />} />
                    <Route path="director/movie-files/:slug" element={<MovieFiles />} />
                    <Route path="director/transactions" element={<h2>O'tkazmalar</h2>} />
                    <Route path="director/reports" element={<DirectorReports />} />
                    <Route path="director/settings" element={<Settings />} />

                    {/* Admin Routes */}
                    <Route path="admin/dashboard" element={<h1>Admin Dashboard</h1>} />
                    <Route path="admin/videos" element={<AdminVideos />} />
                    <Route path="admin/reels" element={<h2>Admin Reels</h2>} />
                    <Route path="admin/channels" element={<h2>Admin Kanallar</h2>} />
                    <Route path="admin/teachers" element={<h2>Admin O'qituvchilar</h2>} />
                    <Route path="admin/assignments" element={<h2>Admin Kashloqlar</h2>} />
                    <Route path="admin/reports" element={<h2>Admin Hisobotlar</h2>} />
                    <Route path="admin/settings" element={<Settings />} />

                    {/* Teacher Routes */}
                    <Route path="teacher/channels" element={<ChannelSelector />} />
                    <Route path="teacher/channel/create" element={<ChannelEditor />} />
                    <Route path="teacher/channel/edit" element={<ChannelEditor />} />

                    {/* Teacher Routes with Channel Slug */}
                    <Route path="teacher/dashboard" element={<RequireTeacherChannel><TeacherDashboard /></RequireTeacherChannel>} />
                    <Route path="teacher/analytics/overview" element={<RequireTeacherChannel><TeacherAnalytics /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/information" element={<RequireTeacherChannel><TeacherInfomration /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/videos" element={<RequireTeacherChannel><TeacherVideos /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/videos/upload" element={<RequireTeacherChannel><VideoUpload /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/reels" element={<RequireTeacherChannel><TeacherReels /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/reels/upload" element={<RequireTeacherChannel><TeacherUploadReels /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/categories/:categoryId" element={<RequireTeacherChannel><CategoryDetail /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/assignments" element={<RequireTeacherChannel><TeacherAssignments /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/assignment-creator" element={<RequireTeacherChannel><AssignmentCreator /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/students" element={<RequireTeacherChannel><TeacherStudents /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/wallet" element={<RequireTeacherChannel><TeacherWallet /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/settings" element={<RequireTeacherChannel><Settings /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/test-creator" element={<RequireTeacherChannel><TestCreator /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/grader" element={<RequireTeacherChannel><AssignmentGrader /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/tests" element={<RequireTeacherChannel><TeacherTests /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/assignments-management" element={<RequireTeacherChannel><TeacherAssignmentsManagement /></RequireTeacherChannel>} />
                    <Route path="teacher/:channelSlug/assignment-review" element={<RequireTeacherChannel><AssignmentReview /></RequireTeacherChannel>} />

                    {/* User Routes */}
                    <Route path="user/dashboard" element={<h1>User Dashboard</h1>} />
                    <Route path="user/courses" element={<UserCourses />} />
                    <Route path="user/reels" element={<UserSavedReels />} />
                    <Route path="user/saved" element={<UserSaved />} />
                    <Route path="user/liked" element={<UserLiked />} />
                    <Route path="user/likes-comments" element={<UserLikesComments />} />
                    <Route path="user/submitted-assignments" element={<UserSubmittedAssignments />} />
                    <Route path="user/tests" element={<UserTestResults />} />
                    <Route path="user/certificates" element={<UserCertificates />} />
                    <Route path="user/wallet" element={<UserWallet />} />
                    <Route path="user/settings" element={<Settings />} />

                    {/* Common Routes */}
                    <Route path="settings" element={<h2>Sozlamalar</h2>} />
                    <Route path="*" element={<h2>Not Found</h2>} />
                </Route>
                <Route path="/watch/:movieSlug" element={<RequireAuth><WatchPage /></RequireAuth>} />
            </Routes>
        </BrowserRouter>
    )
}
