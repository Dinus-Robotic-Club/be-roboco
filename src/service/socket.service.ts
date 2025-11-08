import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'

export let io: Server | null = null

export const setupSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: { origin: '*' },
    })

    io.on('connection', (socket: Socket) => {
        console.log('client connected:', socket.id)

        socket.on('join-tournament', (tournamentId: string) => {
            socket.join(`tournament-${tournamentId}`)
            console.log(`${socket.id} joined tournament-${tournamentId}`)
        })

        socket.on('leave-tournament', (tournamentId: string) => {
            socket.leave(`tournament-${tournamentId}`)
        })

        socket.on('disconnect', () => {
            console.log(`client ${socket.id} terputus `)
        })
    })

    return io
}

export const emitToTournament = <T>(tournamentId: string, event: string, data: T) => {
    if (!io) return
    io.to(`tournament-${tournamentId}`).emit(event, data)
}
