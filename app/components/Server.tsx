import React from 'react';
import { QueryResult } from 'gamedig';

export const Server: React.FC<QueryResult> = (props) => {
    // Implement your component logic here
    const getColorForPlayercount = (num: number, max: number) => {
        if(max === 0) {
            return 'text-gray-500'; // Escape divide by 0
        }
        if(num === 0) {
            return 'text-blue-500'; // Escape divide by 0
        }
        const factor = num / max;
        if (factor > 0.75) {
            return 'text-red-500';
        } else if (factor > 0.5) {
            return 'text-yellow-500';
        } else if (factor > 0.25) {
            return 'text-green-500';
        } else {
            return 'text-blue-500';
        }
    };
    const secondsToHumanReadable = (seconds: number | undefined) => {
        if (seconds === undefined) {
            return '00:00';
        }
        seconds = Math.floor(seconds); // given as a float, handle as an int

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;


        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        if (hours > 0) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    return (
        <div className='rounded-lg border dark:bg-gray-700 bg-gray-300 text-black dark:text-white font-bold sm:shadow w-full max-w-md'>
            <div className="flex-col space-y-1.5 p-6 dark:bg-gray-300 bg-gray-700 dark:text-black text-white px-4 py-3 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                    >
                        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                        <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                        <line x1="6" x2="6.01" y1="6" y2="6"></line>
                        <line x1="6" x2="6.01" y1="18" y2="18"></line>
                    </svg>
                    <div className='text-lg font-bold'>{props.name || 'SERVERNAME'}</div>
                </div>
                <div className='text-sm text-gray-500'>
                    <span className='font-medium'>Map: {props.map || 'MAPNAME'}</span>
                </div>
                <div className='mt-4 text-sm text-white hidden sm:block'>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                        Connect
                    </button>
                </div>
            </div>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='text-2xl font-bold'>
                        <span className={getColorForPlayercount(props.numplayers || 0,props.maxplayers || 0)}>{props.numplayers || 0}</span> / {props.maxplayers || 0}
                    </div>
                    <div className='text-sm text-gray-500'>Players Online</div>
                </div>
                <div className='max-h-52 overflow-y-auto'>
                    <div className='space-y-1 px-3.5'>
                        {props.players?.map((player) => (
                            <div key={player.name} className='flex items-center justify-between text-sm'>
                                <div className='flex items-center gap-2'>
                                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-6 w-6">
                                        <svg className='aspect-square h-full w-full' fill='none' viewBox='0 0 32 32' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z' />
                                        </svg>
                                    </span>
                                    <div>{player.name}</div>
                                </div>
                                <div className='text-gray-500 flex items-center'>{secondsToHumanReadable((player.raw as { time?: number })?.time) /* This is stupid */}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ServerSkeleton: React.FC = () => {

    return ( <></> )
}
