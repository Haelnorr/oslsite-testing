interface Callout {
    type: string;
    has: boolean;
    header: string|undefined;
    message: string|undefined;
}

const Callout = (callout:Callout) => {
    return (
        <div id="callout" className={`${callout.has ? 'visible' : 'hidden'} ${callout.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : ''} ${callout.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : ''} px-4 py-3 rounded relative`} role="alert">
            <strong className="font-bold pe-3">{callout.header}</strong>
            <span className="block sm:inline">{callout.message}</span>
        </div>
    )
}

export default Callout;